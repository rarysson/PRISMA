<template>
  <div>
    <joint-paper @mounted="set_graph">
      <joint-place v-if="graph !== null" :graph="graph" />
      <joint-transition v-if="graph !== null" :graph="graph" />
    </joint-paper>
  </div>
</template>

<script>
import JointPaper from "@/components/JointPaper";
import JointPlace from "@/components/JointPlace";
import JointTransition from "@/components/JointTransition";

export default {
  name: "Home",

  components: {
    JointPaper,
    JointPlace,
    JointTransition
  },

  data() {
    return {
      graph: null
    };
  },

  methods: {
    set_graph(graph) {
      this.graph = graph;
    }
  }
};
</script>
