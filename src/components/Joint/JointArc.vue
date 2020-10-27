<template>
  <div hidden></div>
</template>

<script>
import { get_valid_number } from "@/util/funcs";

const petri_net = window.joint.shapes.pn;

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
    },

    jointObj: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      arc: null
    };
  },

  mounted() {
    const weight = get_valid_number(this.attrs.weight, 1);

    if (this.jointObj) {
      this.arc = this.jointObj;
    } else {
      this.arc = new petri_net.Link({
        source: { id: this.attrs.source, selector: ".root" },
        target: { id: this.attrs.target, selector: ".root" },
        attrs: {
          ".connection": {
            "fill": "none",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            "stroke": "#3a3a3a"
          },
          ".link-tools": {
            display: "none"
          }
        },
        weight
      }).appendLabel({
        attrs: {
          text: {
            text: weight
          }
        }
      });

      this.graph.addCell(this.arc);
      this.$emit("mounted", this.arc.id);
    }
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

<style>
.link-tools .tool-remove {
  display: none;
}
</style>
