<template>
  <div hidden></div>
</template>

<script>
const petri_net = window.joint.shapes.pn;

function get_valid_weight(weight) {
  const w = weight || 1;
  return w >= 1 ? w : 1;
}

export default {
  name: "JointArc",

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
      arc: null
    };
  },

  mounted() {
    this.arc = new petri_net.Link({
      source: { id: this.attrs.source, selector: ".root" },
      target: { id: this.attrs.target, selector: ".root" },
      attrs: {
        ".connection": {
          "fill": "none",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          "stroke": "#3a3a3a"
        }
      },
      weight: get_valid_weight(this.attrs.weight)
    }).appendLabel({
      attrs: {
        text: {
          text: get_valid_weight(this.attrs.weight)
        }
      }
    });

    this.graph.addCell(this.arc);
    this.$emit("mounted", this.arc.id);
  },

  beforeDestroy() {
    this.arc.remove();
  },

  watch: {
    attrs: {
      deep: true,
      handler({ weight }) {
        if (weight >= 1) {
          this.arc.set("weight", weight);
          this.arc.prop("labels/0/attrs/text/text", weight);
        }
      }
    }
  }
};
</script>
