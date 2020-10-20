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
    },

    jointObj: {
      type: Object
    }
  },

  data() {
    return {
      transition: null
    };
  },

  mounted() {
    if (this.jointObj) {
      this.transition = this.jointObj;
    } else {
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
      this.$emit("mounted", this.transition.id);
    }
  },

  beforeDestroy() {
    this.transition.remove();
  },

  watch: {
    attrs: {
      deep: true,
      handler({ name }) {
        this.transition.attr(".label/text", name);
      }
    }
  }
};
</script>
