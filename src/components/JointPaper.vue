<template>
  <div class="paper-container">
    <div id="joint-paper">
      <slot />
    </div>
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
      multiLinks: false
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

    this.paper.on("link:pointerclick", (element) => {
      this.$emit("link-click", element.model.id);
    });

    this.$emit("mounted", graph);
  }
};
</script>

<style scoped>
.paper-container {
  min-width: 800px;
  min-height: 600px;
  display: grid;
  place-items: center;
}
</style>
