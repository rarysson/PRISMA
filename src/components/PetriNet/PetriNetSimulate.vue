<template>
  <joint-paper
    v-if="graph !== null && !is_net_empty"
    class="simulate-paper"
    :graph="graph"
    :extra-options="{ interactive: false }"
    :freeze-dimensions="true"
    @element-click="handle_element_click"
    @mounted="paper = $event"
  />
  <prisma-logo v-else />
</template>

<script>
import { mapGetters } from "vuex";
import { sleep, get_formatted_joint_type } from "@/util/funcs";
import JointPaper from "@/components/Joint/JointPaper";
import PrismaLogo from "@/components/Widgets/PetriNet/PrismaLogo";

function shuffle_array(array) {
  let tmp_value, random_index;
  let current_index = array.length;

  while (current_index !== 0) {
    random_index = Math.floor(Math.random() * current_index);
    current_index -= 1;
    tmp_value = array[current_index];
    array[current_index] = array[random_index];
    array[random_index] = tmp_value;
  }

  return array;
}

export default {
  name: "PetriNetSimulate",

  components: {
    JointPaper,
    PrismaLogo
  },

  data() {
    return {
      graph: null,
      paper: null,
      on_animation: false,
      fired_transitions: [],
      backwards_index: -1,
      transitions: []
    };
  },

  mounted() {
    this.graph = new window.joint.dia.Graph();

    if (!this.is_net_empty) {
      this.graph.fromJSON(this.net);
      this.change_transitions_color(this.net.cells);
      this.transitions = this.graph
        .getCells()
        .filter(
          (cell) =>
            get_formatted_joint_type(cell.attributes.type) === "transition"
        );
    }
  },

  computed: {
    ...mapGetters(["is_net_empty", "net"])
  },

  methods: {
    handle_element_click({ id, type }) {
      if (type === "transition" && !this.on_animation) {
        const links = this.graph.getConnectedLinks(this.graph.getCell(id));
        const source_places = this.get_source_places(links, id);
        const target_places = this.get_target_places(links, id);

        this.change_net_state(source_places, target_places);
        this.transition_triggered(id);
      }
    },

    get_source_places(links, id) {
      return links
        .filter((link) => link.attributes.target.id === id)
        .map((link) => ({
          weight: link.attributes.weight,
          element: this.graph.getCell(link.attributes.source.id),
          link
        }));
    },

    get_target_places(links, id) {
      return links
        .filter((link) => link.attributes.source.id === id)
        .map((link) => ({
          weight: link.attributes.weight,
          element: this.graph.getCell(link.attributes.target.id),
          link
        }));
    },

    transition_triggered(id) {
      this.backwards_index++;
      this.fired_transitions = this.fired_transitions.slice(
        0,
        this.backwards_index
      );
      this.fired_transitions[this.backwards_index] = id;
    },

    async random_state(data) {
      let triggered = false;
      const tmp_transitions = shuffle_array(this.transitions);

      for (let i = 0; i < tmp_transitions.length; i++) {
        const id = tmp_transitions[i].id;
        const links = this.graph.getConnectedLinks(this.graph.getCell(id));
        const source_places = this.get_source_places(links, id);

        if (this.can_fire_transition(source_places)) {
          const target_places = this.get_target_places(links, id);
          // eslint-disable-next-line no-await-in-loop
          await this.change_net_state(source_places, target_places, {
            time: data.time
          });
          triggered = true;
          this.transition_triggered(id);
          break;
        }
      }

      data.steps--;

      if (data.steps > 0 && triggered) {
        this.random_state(data);
      }
    },

    async revert_net_state(data) {
      let triggered = false;

      if (data.type === "backward" && this.backwards_index >= 0) {
        triggered = true;
        const id = this.fired_transitions[this.backwards_index];
        const links = this.graph.getConnectedLinks(this.graph.getCell(id));
        const source_places = this.get_source_places(links, id);
        const target_places = this.get_target_places(links, id);

        await this.change_net_state(target_places, source_places, {
          time: data.time,
          direction: "reverse"
        });
        this.backwards_index--;
      } else if (
        data.type === "forward" &&
        this.backwards_index < this.fired_transitions.length - 1
      ) {
        triggered = true;
        this.backwards_index++;
        const id = this.fired_transitions[this.backwards_index];
        const links = this.graph.getConnectedLinks(this.graph.getCell(id));
        const source_places = this.get_source_places(links, id);
        const target_places = this.get_target_places(links, id);

        await this.change_net_state(source_places, target_places, {
          time: data.time
        });
      }

      data.steps--;

      if (data.steps > 0 && triggered) {
        this.revert_net_state(data);
      }
    },

    async change_net_state(source_places, target_places, options = {}) {
      if (this.can_fire_transition(source_places)) {
        this.on_animation = true;
        const time = options.time ?? 500;

        this.change_sources(source_places, time, options.direction);

        if (source_places.length > 0) {
          await sleep(time);
        }

        if (target_places.length > 0) {
          this.change_targets(target_places, time, options.direction);
          await sleep(time);
        } else {
          this.on_animation = false;
        }

        this.change_transitions_color(this.graph.toJSON().cells);
      }
    },

    can_fire_transition(sources) {
      let fired_sources = 0;

      sources.forEach((source) => {
        const tokens = source.element.get("tokens");

        if (source.weight <= tokens) {
          fired_sources++;
        }
      });

      return fired_sources === sources.length;
    },

    change_sources(source_places, time, direction = "normal") {
      source_places.forEach((source) => {
        const token_element = window.joint.V("circle", {
          r: 5,
          fill: "#feb662"
        });
        const tokens = source.element.get("tokens");

        source.element.set("tokens", tokens - source.weight);

        if (time > 0) {
          source.link
            .findView(this.paper)
            .sendToken(token_element, { duration: time, direction });
        }
      });
    },

    change_targets(target_places, time, direction = "normal") {
      let token_set = 0;

      target_places.forEach((target) => {
        const token_element = window.joint.V("circle", {
          r: 5,
          fill: "#feb662"
        });
        const tokens = target.element.get("tokens");

        if (time > 0) {
          target.link
            .findView(this.paper)
            .sendToken(token_element, { duration: time, direction }, () => {
              target.element.set("tokens", tokens + target.weight);
              token_set++;
              this.on_animation = token_set !== target_places.length;
            });
        } else {
          target.element.set("tokens", tokens + target.weight);
          this.on_animation = false;
        }
      });
    },

    change_transitions_color(cells) {
      cells.forEach((cell) => {
        if (get_formatted_joint_type(cell.type) === "transition") {
          const links = this.graph.getConnectedLinks(cell);
          const sources = this.get_source_places(links, cell.id);
          const transition = this.graph.getCell(cell.id);

          if (this.can_fire_transition(sources)) {
            transition.attr(".root/fill", "#28a745");
          } else {
            transition.attr(".root/fill", "#ffffff");
          }
        }
      });
    }
  }
};
</script>

<style>
.simulate-paper :is(.marker-arrowheads, .marker-vertices, .connection-wrap) {
  display: none;
}

.simulate-paper .joint-type-pn-place {
  cursor: default;
}

.simulate-paper .joint-type-pn-transition {
  cursor: pointer;
}
</style>
