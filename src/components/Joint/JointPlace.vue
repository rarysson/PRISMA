<template>
  <div hidden></div>
</template>

<script>
import { get_valid_number } from "@/util/funcs";

const petri_net = window.joint.shapes.pn;

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
    },

    jointObj: {
      type: Object
    }
  },

  data() {
    return {
      place: null
    };
  },

  mounted() {
    if (this.jointObj) {
      this.place = this.jointObj;
    } else {
      this.place = new petri_net.Place({
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
        tokens: get_valid_number(this.attrs.tokens, 0)
      });

      this.graph.addCell(this.place);
      this.$emit("mounted", this.place.id);
    }
  },

  beforeDestroy() {
    this.place.remove();
  },

  watch: {
    attrs: {
      deep: true,
      handler({ name, tokens }) {
        if (tokens >= 0) {
          this.place.set("tokens", tokens);
        }

        this.place.attr(".label/text", name);
      }
    }
  }
};
</script>
