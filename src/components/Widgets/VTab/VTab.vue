<template>
  <div v-if="is_active">
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
