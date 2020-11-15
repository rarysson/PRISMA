<template>
  <joint-paper
    v-if="graph !== null && !is_net_empty"
    class="archive-paper"
    :graph="graph"
    :extra-options="{ interactive: false }"
    :freeze-dimensions="true"
  />
  <prisma-logo v-else />
</template>

<script>
import { mapGetters } from "vuex";
import JointPaper from "@/components/Joint/JointPaper";
import PrismaLogo from "@/components/Widgets/PetriNet/PrismaLogo";

export default {
  name: "PetriNetArchive",

  components: {
    JointPaper,
    PrismaLogo
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
.archive-paper .marker-arrowheads,
.archive-paper .marker-vertices,
.archive-paper .connection-wrap {
  display: none;
}

.archive-paper .joint-cell {
  cursor: default;
}
</style>
