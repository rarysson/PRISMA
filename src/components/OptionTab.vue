<template>
  <div v-show="is_active">
    <slot />
  </div>
</template>

<script>
export default {
  name: "OptionTab",

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
