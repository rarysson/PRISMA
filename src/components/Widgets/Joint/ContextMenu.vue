<template>
  <form
    v-if="element !== null"
    class="context-menu-container"
    :style="{
      top: `${position.y}px`,
      left: `${position.x}px`
    }"
    @submit.prevent="submit"
  >
    <input
      v-if="element.name !== undefined"
      type="text"
      required
      v-model="element.name"
    />
    <input
      v-if="element.tokens !== undefined"
      type="number"
      min="0"
      required
      v-model.number="element.tokens"
    />
    <input
      v-if="element.weight !== undefined"
      type="number"
      min="1"
      required
      v-model.number="element.weight"
    />
    <div>
      <button type="button" @click="element = null">
        Cancelar
      </button>
      <button type="submit">
        Atualizar
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: "ContextMenu",

  props: {
    data: {
      required: true,
      validator(data) {
        return typeof data === "object" || data === null;
      }
    },

    position: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      element: this.data
    };
  },

  watch: {
    data(new_val) {
      this.element = new_val;
    }
  },

  methods: {
    submit() {
      this.$emit("update", this.element);
    }
  }
};
</script>

<style scoped>
.context-menu-container {
  position: absolute;
  border: 1px solid black;
  background-color: white;
  width: 150px;
}
</style>
