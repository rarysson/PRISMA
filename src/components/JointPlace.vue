<template>
  <div hidden></div>
</template>

<script>
const petri_net = window.joint.shapes.pn;
let place;

function get_valid_tokens(tokens) {
  const t = tokens || 0;
  return t >= 0 ? t : 0;
}

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
      tokens: get_valid_tokens(this.attrs.tokens)
    });

    this.graph.addCell(place);

    this.$emit("mounted", place.id);
  },

  watch: {
    attrs: {
      deep: true,
      handler(new_val) {
        if (new_val.tokens >= 0) {
          place.set("tokens", new_val.tokens);
        }
      }
    }
  }
};
</script>
