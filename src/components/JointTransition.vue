<template>
  <div hidden></div>
</template>

<script>
const petri_net = window.joint.shapes.pn;

export default {
  name: "JointTransition",

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

  data() {
    return {
      transition: null
    };
  },

  mounted() {
    this.transition = new petri_net.Transition({
      position: { x: this.attrs.position.x, y: this.attrs.position.y },
      attrs: {
        ".label": {
          text: this.attrs.name,
          fill: "#3a3a3a"
        },
        ".root": {
          "fill": "#ffffff",
          "stroke": "#3a3a3a",
          "stroke-width": 2
        }
      }
    });

    this.graph.addCell(this.transition);
  }
};
</script>
