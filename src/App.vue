<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
@import url("~@/styles/reset.css");

#app {
  position: relative;
  z-index: 0;
  min-height: 100vh;
  background-color: whitesmoke;
}
</style>
