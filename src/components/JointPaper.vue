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
      gridSize: 5,
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

    this.paper.on("blank:pointerclick", (event, x, y) => {
      this.$emit("blank-click", { x, y });
    });

    this.paper.on("element:pointerclick", (element) => {
      const id = element.model.id;
      const type = element.model.attributes.type
        .replace("pn.", "")
        .toLowerCase();

      this.$emit("element-click", { id, type });
    });

    this.paper.on("element:contextmenu", (element, event, x, y) => {
      const id = element.model.id;
      const type = element.model.attributes.type
        .replace("pn.", "")
        .toLowerCase();

      x += this.$refs.paper.offsetLeft;
      y += this.$refs.paper.offsetTop;

      this.$emit("element-contextmenu", { id, type, position: { x, y } });
    });

    this.paper.on("link:pointerclick", (element) => {
      this.$emit("link-click", { id: element.model.id, type: "arc" });
    });

    this.paper.on("link:contextmenu", (element, event, x, y) => {
      const id = element.model.id;

      x += this.$refs.paper.offsetLeft;
      y += this.$refs.paper.offsetTop;

      this.$emit("link-contextmenu", { id, type: "arc", position: { x, y } });
    });

    this.$emit("mounted", graph);
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
