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
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;700;900&display=swap");
@import url("~@/styles/reset.css");

body {
  background-color: whitesmoke;
}

#app {
  position: relative;
  z-index: 0;
  min-height: 100vh;
  font-family: "Roboto", sans-serif;
}
</style>
