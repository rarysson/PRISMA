<template>
  <div hidden></div>
</template>

<script>
const petri_net = window.joint.shapes.pn;
let place;

export default {
  name: "JointPlace",

  props: {
    graph: {
      type: Object,
      required: true
    },

    attrs: {
      type: Object,
      required: true
    }
  },

  mounted() {
    place = new petri_net.Place({
      position: { x: this.attrs.position.x, y: this.attrs.position.y },
      attrs: {
        ".label": {
          text: this.attrs.name,
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

    this.graph.addCell(place);
  }
};
</script>
