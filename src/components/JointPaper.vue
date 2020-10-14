<template>
  <div class="paper-container">
    <div id="joint-paper">
      <slot />
    </div>
  </div>
</template>

<script>
const graph = new window.joint.dia.Graph();
let paper;

export default {
  name: "JointPaper",

  mounted() {
    paper = new window.joint.dia.Paper({
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

    paper.on("blank:pointerclick", (event, x, y) => {
      this.$emit("blank-click", { x, y });
    });

    paper.on("element:pointerclick", (element) => {
      this.$emit("element-click", element.model.id);
    });

    this.$emit("mounted", graph);
  }
};
</script>

<style scoped>
.paper-container {
  width: 100vw;
  min-width: 800px;
  min-height: 600px;
  display: grid;
  place-items: center;
}
</style>
