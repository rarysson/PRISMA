<template>
  <div class="paper-container">
    <div id="joint-paper" ref="paper">
      <slot />
    </div>
    <slot name="overlay-elements" />
  </div>
</template>

<script>
const graph = new window.joint.dia.Graph();

function get_formatted_type(type) {
  return type.replace("pn.", "").toLowerCase();
}

export default {
  name: "JointPaper",

  data() {
    return {
      paper: null
    };
  },

  mounted() {
    this.paper = new window.joint.dia.Paper({
      el: document.getElementById("joint-paper"),
      model: graph,
      width: 800,
      height: 400,
      gridSize: 1,
      defaultAnchor: { name: "center" },
      defaultConnectionPoint: { name: "boundary" },
      linkPinning: false,
      multiLinks: false,
      allowLink(link) {
        const source_type = link.sourceView.model.attributes.type;
        const target_type = link.targetView.model.attributes.type;

        return source_type !== target_type;
      }
    });

    this.paper.on("blank:pointerclick", this.handle_blank_click);
    this.paper.on("element:pointerclick", this.handle_element_click);
    this.paper.on("element:contextmenu", this.handle_context_menu);
    this.paper.on("link:pointerclick", this.handle_element_click);
    this.paper.on("link:contextmenu", this.handle_context_menu);
    this.$emit("mounted", graph);
  },

  beforeDestroy() {
    this.paper.off("blank:pointerclick", this.handle_blank_click);
    this.paper.off("element:pointerclick", this.handle_element_click);
    this.paper.off("element:contextmenu", this.handle_context_menu);
    this.paper.off("link:pointerclick", this.handle_element_click);
    this.paper.off("link:contextmenu", this.handle_context_menu);
  },

  methods: {
    handle_blank_click(event, x, y) {
      this.$emit("blank-click", { x, y });
    },

    handle_element_click(element) {
      const id = element.model.id;
      let type = get_formatted_type(element.model.attributes.type);
      type = type === "link" ? "arc" : type;

      this.$emit("element-click", { id, type });
    },

    handle_context_menu(element, event, x, y) {
      const id = element.model.id;
      let type = get_formatted_type(element.model.attributes.type);
      type = type === "link" ? "arc" : type;

      x += this.$refs.paper.offsetLeft;
      y += this.$refs.paper.offsetTop;

      this.$emit("element-contextmenu", { id, type, position: { x, y } });
    }
  }
};
</script>

<style scoped>
.paper-container {
  position: relative;
  min-width: 800px;
  min-height: 600px;
  display: grid;
  place-items: center;
}
</style>