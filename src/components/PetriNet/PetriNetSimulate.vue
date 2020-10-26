<template>
  <joint-paper
    v-if="graph !== null"
    :graph="graph"
    :extra-options="{ interactive: false }"
    :freeze-dimensions="true"
    @element-click="handle_element_click"
    @mounted="paper = $event"
  />
</template>

<script>
import { mapGetters } from "vuex";
import { sleep, get_formatted_joint_type } from "@/util/funcs";
import JointPaper from "@/components/Joint/JointPaper";

export default {
  name: "PetriNetSimulate",

  components: {
    JointPaper
  },

  data() {
    return {
      graph: null,
      paper: null,
      on_animation: false
    };
  },

  mounted() {
    this.graph = new window.joint.dia.Graph();

    if (!this.is_net_empty) {
      this.graph.fromJSON(this.net);
      this.change_transitions_color(this.net.cells);
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

        this.change_petri_net_state(source_places, target_places);
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

    async change_petri_net_state(source_places, target_places) {
      if (this.can_fire_transition(source_places)) {
        this.on_animation = true;
        const time = 500;

        this.change_sources(source_places, time);

        if (source_places.length > 0) {
          await sleep(time);
        }

        if (target_places.length > 0) {
          this.change_targets(target_places, time);
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

    change_sources(source_places, time) {
      source_places.forEach((source) => {
        const token_element = window.joint.V("circle", {
          r: 5,
          fill: "#feb662"
        });
        const tokens = source.element.get("tokens");

        source.element.set("tokens", tokens - source.weight);
        source.link.findView(this.paper).sendToken(token_element, time);
      });
    },

    change_targets(target_places, time) {
      let token_set = 0;

      target_places.forEach((target) => {
        const token_element = window.joint.V("circle", {
          r: 5,
          fill: "#feb662"
        });
        const tokens = target.element.get("tokens");

        target.link.findView(this.paper).sendToken(token_element, time);
        setTimeout(() => {
          target.element.set("tokens", tokens + target.weight);
          token_set++;
          this.on_animation = token_set !== target_places.length;
        }, time);
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
