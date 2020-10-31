<template>
  <button @click="emit_event">
    <slot />
  </button>
</template>

<script>
export default {
  name: "BtnIcon",

  methods: {
    emit_event(event) {
      if (event.target.tagName === "I") {
        this.$emit("click", { target: event.target.parentElement });
      } else {
        this.$emit("click", event);
      }
    }
  }
};
</script>

<style scoped>
button {
  position: relative;
  padding: 15px;
  border: 1px solid transparent;
  border-radius: 5px;
  background-color: white;
}

button:hover {
  border-color: var(--dark);
}

button:not(:first-of-type) {
  margin-left: 15px;
}

button i {
  display: block;
  margin-bottom: 3px;
}
</style>
