<template>
  <joint-paper
    v-if="graph !== null"
    :graph="graph"
    :extra-options="{ interactive: false }"
    @element-click="handle_element_click"
  />
</template>

<script>
import { mapGetters } from "vuex";
import JointPaper from "@/components/Joint/JointPaper";

export default {
  name: "PetriNetSimulate",

  components: {
    JointPaper
  },

  data() {
    return {
      graph: null
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
      if (type === "transition") {
        const links = this.graph.getConnectedLinks(this.graph.getCell(id));
        const source_places = [];
        const target_places = [];

        links.forEach((link) => {
          if (link.attributes.target.id === id) {
            source_places.push({
              weight: link.attributes.weight,
              element: this.graph.getCell(link.attributes.source.id)
            });
          } else if (link.attributes.source.id === id) {
            target_places.push({
              weight: link.attributes.weight,
              element: this.graph.getCell(link.attributes.target.id)
            });
          }
        });

        this.change_petri_net_state(source_places, target_places);
      }
    },

    change_petri_net_state(source_places, target_places) {
      let fired_sources = 0;

      source_places.forEach((source) => {
        const tokens = source.element.get("tokens");

        if (source.weight <= tokens) {
          fired_sources++;
        }
      });

      if (fired_sources === source_places.length) {
        source_places.forEach((source) => {
          const tokens = source.element.get("tokens");
          source.element.set("tokens", tokens - source.weight);
        });

        target_places.forEach((target) => {
          const tokens = target.element.get("tokens");
          target.element.set("tokens", tokens + target.weight);
        });
      }
    }
  }
};
</script>
