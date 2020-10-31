<template>
  <div class="v-tabs">
    <button
      v-for="(tab, index) in tabs"
      :class="{ 'tab-option': true, 'active': index === current_tab_index }"
      :key="tab"
      @click="change_tab(tab)"
    >
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
      tabs: [],
      current_tab: this.selected,
      current_tab_index: 0
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
      this.current_tab_index = this.tabs.findIndex(
        (tab) => tab === this.current_tab
      );

      this.$children.forEach((child) => {
        child.is_active = child.name === tab;
      });

      this.$emit("change", this.current_tab);
    }
  }
};
</script>

<style scoped>
.v-tabs {
  padding: 20px 50px;
}

.tab-option {
  position: relative;
  padding: 10px;
  background-color: var(--light-gray);
  border: 1px solid var(--light-gray);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.tab-option.active {
  background-color: white;
}

.tab-option:hover {
  border-color: black;
  border-bottom-color: var(--light-gray);
}

.tab-option.active {
  border-color: black;
  border-bottom-color: white;
}

.tab-option.active::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 1px;
  bottom: -2px;
  left: 0;
  background-color: white;
}

.tab-option:not(:first-child) {
  margin-left: 5px;
}
</style>
