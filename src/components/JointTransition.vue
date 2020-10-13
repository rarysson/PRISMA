<template>
  <div style="display: none;"></div>
</template>

<script>
const petri_net = window.joint.shapes.pn;
const transition = new petri_net.Transition({
  position: { x: 300, y: 150 },
  attrs: {
    ".label": {
      text: "Transition",
      fill: "#3a3a3a"
    },
    ".root": {
      "fill": "#ffffff",
      "stroke": "#3a3a3a",
      "stroke-width": 2
    }
  }
});

export default {
  name: "JointTransition",

  props: {
    graph: {
      type: Object,
      required: true
    }
  },

  mounted() {
    this.graph.addCell(transition);
  }
};
</script>
