<template>
  <button type="button" @click="$emit('click')">
    <slot />
  </button>
</template>

<script>
export default {
  name: "BtnClose"
};
</script>

<style scoped>
button {
  padding: 10px 20px;
  border-radius: 5px;
  border: 1px solid var(--danger);
  color: var(--light);
  background-color: var(--danger);
}

button:hover {
  color: var(--danger);
  background-color: var(--light);
}
</style>
