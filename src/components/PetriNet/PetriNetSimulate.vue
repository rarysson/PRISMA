<template>
  <joint-paper
    v-if="graph !== null"
    :graph="graph"
    :extra-options="{ interactive: false }"
    @element-click="handle_element_click"
    @mounted="paper = $event"
  />
</template>

<script>
import { mapGetters } from "vuex";
import { sleep } from "@/util/funcs";
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
    }
  },

  computed: {
    ...mapGetters(["is_net_empty", "net"])
  },

  methods: {
    handle_element_click({ id, type }) {
      if (type === "transition" && !this.on_animation) {
        const links = this.graph.getConnectedLinks(this.graph.getCell(id));
        const source_places = [];
        const target_places = [];

        links.forEach((link) => {
          if (link.attributes.target.id === id) {
            source_places.push({
              weight: link.attributes.weight,
              element: this.graph.getCell(link.attributes.source.id),
              link
            });
          } else if (link.attributes.source.id === id) {
            target_places.push({
              weight: link.attributes.weight,
              element: this.graph.getCell(link.attributes.target.id),
              link
            });
          }
        });

        this.change_petri_net_state(source_places, target_places);
      }
    },

    async change_petri_net_state(source_places, target_places) {
      let fired_sources = 0;

      source_places.forEach((source) => {
        const tokens = source.element.get("tokens");

        if (source.weight <= tokens) {
          fired_sources++;
        }
      });

      if (fired_sources === source_places.length) {
        this.on_animation = true;
        const time = 500;

        this.change_sources(source_places, time);

        if (source_places.length > 0) {
          await sleep(time);
        }

        if (target_places.length > 0) {
          this.change_targets(target_places, time);
        } else {
          this.on_animation = false;
        }
      }
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
      target_places.forEach((target) => {
        const token_element = window.joint.V("circle", {
          r: 5,
          fill: "#feb662"
        });
        const tokens = target.element.get("tokens");

        target.link.findView(this.paper).sendToken(token_element, time);
        setTimeout(() => {
          target.element.set("tokens", tokens + target.weight);
          this.on_animation = false;
        }, time);
      });
    }
  }
};
</script>
