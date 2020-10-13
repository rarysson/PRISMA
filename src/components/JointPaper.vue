<template>
  <div class="paper-container">
    <div id="joint-paper" ref="paper">
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
      defaultAnchor: { name: "perpendicular" },
      defaultConnectionPoint: { name: "boundary" },
      linkPinning: false,
      multiLinks: false
    });

    paper.on("blank:pointerclick", (event, x, y) => {
      this.$emit("click", { x, y });
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
