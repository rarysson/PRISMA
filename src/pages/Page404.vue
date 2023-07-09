<template>
  <div class="page-container">
    <h1>{{ $t("404.title") }}</h1>
    <router-link to="/">
      <button>{{ $t("404.action") }}</button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "Page404"
};
</script>

<style scoped>
.page-container {
  height: 100vh;
  display: grid;
  place-items: center;
  align-content: center;
}
</style>
