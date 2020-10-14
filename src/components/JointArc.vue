<template>
  <div hidden></div>
</template>

<script>
const petri_net = window.joint.shapes.pn;

export default {
  name: "JointArc",

  props: {
    graph: {
      type: Object,
      required: true
    },

    weight: {
      type: Number,
      default: 1,
      validator(value) {
        return value >= 1;
      }
    },

    source: {
      type: String,
      required: true
    },

    target: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      arc: null
    };
  },

  mounted() {
    this.arc = new petri_net.Link({
      source: { id: this.source, selector: ".root" },
      target: { id: this.target, selector: ".root" },
      attrs: {
        ".connection": {
          "fill": "none",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          "stroke": "#3a3a3a"
        }
      }
    }).appendLabel({
      attrs: {
        text: {
          text: this.weight
        }
      }
    });

    this.graph.addCell(this.arc);
    this.$emit("mounted", this.arc.id);
  },

  beforeDestroy() {
    this.arc.remove();
  }
};
</script>
