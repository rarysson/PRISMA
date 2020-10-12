<template>
  <div class="paper-container">
    <div id="joint-paper"></div>
  </div>
</template>

<script>
const graph = new window.joint.dia.Graph();
// eslint-disable-next-line no-unused-vars
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
  }
};
</script>

<style scoped>
.paper-container {
  width: 100%;
  height: 100vh;
  display: grid;
  place-items: center;
}
</style>
