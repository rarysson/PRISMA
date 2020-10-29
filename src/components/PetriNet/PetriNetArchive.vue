<template>
  <joint-paper
    v-if="graph !== null"
    class="archive-paper"
    :graph="graph"
    :extra-options="{ interactive: false }"
    :freeze-dimensions="true"
  />
</template>

<script>
import { mapGetters } from "vuex";
import JointPaper from "@/components/Joint/JointPaper";

export default {
  name: "PetriNetArchive",

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
  }
};
</script>

<style>
.archive-paper :is(.marker-arrowheads, .marker-vertices, .connection-wrap) {
  display: none;
}

.archive-paper .joint-cell {
  cursor: default;
}
</style>
