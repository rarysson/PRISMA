<template>
  <button type="submit" @click="$emit('click')">
    <slot />
  </button>
</template>

<script>
export default {
  name: "BtnConfirm"
};
</script>

<style scoped>
button {
  padding: 10px 20px;
  border: 1px solid var(--success);
  border-radius: 5px;
  color: var(--light);
  background-color: var(--success);
}

button:hover {
  color: var(--success);
  background-color: var(--light);
}
</style>
