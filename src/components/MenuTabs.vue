<template>
  <div>
    <button v-for="tab in tabs" :key="tab" @click="change_tab(tab)">
      {{ tab }}
    </button>
    <slot />
  </div>
</template>

<script>
export default {
  name: "MenuTabs",

  data() {
    return {
      current_tab: "",
      tabs: []
    };
  },

  mounted() {
    this.tabs = this.$children.map((child) => child.name);
    this.current_tab = this.tabs[0];
    this.$children[0].is_active = true;
  },

  methods: {
    change_tab(tab) {
      this.$children.forEach((child) => {
        child.is_active = child.name === tab;
      });
    }
  }
};
</script>
