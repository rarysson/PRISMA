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
  name: "VTabs",

  props: {
    selected: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      current_tab: this.selected,
      tabs: []
    };
  },

  mounted() {
    this.tabs = this.$children.map((child) => child.name);
    this.current_tab = this.tabs[0];
    this.$children[0].is_active = true;
    this.$emit("change", this.current_tab);
  },

  watch: {
    selected(val) {
      if (val !== this.current_tab) {
        this.change_tab(val);
      }
    }
  },

  methods: {
    change_tab(tab) {
      this.current_tab = tab;

      this.$children.forEach((child) => {
        child.is_active = child.name === tab;
      });

      this.$emit("change", this.current_tab);
    }
  }
};
</script>
