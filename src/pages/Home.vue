<template>
  <div>
    <joint-paper @mounted="set_graph">
      <joint-place v-if="graph !== null" :graph="graph" />
    </joint-paper>
  </div>
</template>

<script>
import JointPaper from "@/components/JointPaper";
import JointPlace from "@/components/JointPlace";

export default {
  name: "Home",

  components: {
    JointPaper,
    JointPlace
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
