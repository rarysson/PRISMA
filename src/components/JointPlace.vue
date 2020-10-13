<template>
  <div style="display: none;"></div>
</template>

<script>
const petri_net = window.joint.shapes.pn;
const place = new petri_net.Place({
  position: { x: 0, y: 0 },
  attrs: {
    ".label": {
      text: "Place",
      fill: "#3a3a3a"
    },
    ".root": {
      "stroke": "#3a3a3a",
      "stroke-width": 2
    },
    ".tokens > circle": {
      fill: "#7a7e9b"
    }
  },
  tokens: 0
});

export default {
  name: "JointPlace",

  props: {
    graph: {
      type: Object,
      required: true
    }
  },

  mounted() {
    this.graph.addCell(place);
  }
};
</script>
