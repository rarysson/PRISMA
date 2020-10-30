<template>
  <div v-if="is_active" class="tab">
    <slot />
  </div>
</template>

<script>
export default {
  name: "VTab",

  props: {
    title: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      is_active: false,
      name: this.title
    };
  }
};
</script>

<style scoped>
.tab {
  padding: 20px 15px;
  background-color: white;
  border: 1px solid black;
  height: 120px;
  display: flex;
  align-items: center;
}

.tab > * {
  width: 100%;
}
</style>
