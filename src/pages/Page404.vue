<template>
  <div class="page-container">
    <h1>A página que você digitou não existe</h1>
    <router-link to="/">
      <button>Voltar para a página inicial</button>
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
