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
    <div class="input-container" v-if="element.name !== undefined">
      <input type="text" id="net-name" required v-model="element.name" />
      <label for="net-name">Nome</label>
    </div>
    <div class="input-container" v-if="element.tokens !== undefined">
      <input
        type="number"
        id="tokens"
        min="0"
        required
        v-model.number="element.tokens"
      />
      <label for="tokens">Fichas</label>
    </div>
    <div class="input-container" v-if="element.weight !== undefined">
      <input
        type="number"
        id="weight"
        min="1"
        required
        v-model.number="element.weight"
      />
      <label for="weight">Peso</label>
    </div>

    <div class="btns-container">
      <btn-close class="btn" @click="element = null">Cancelar</btn-close>
      <btn-confirm class="btn">Atualizar</btn-confirm>
    </div>
  </form>
</template>

<script>
import BtnClose from "@/components/Widgets/Btns/BtnClose";
import BtnConfirm from "@/components/Widgets/Btns/BtnConfirm";

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

  components: {
    BtnClose,
    BtnConfirm
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
  width: 200px;
  height: 150px;
  padding: 30px 15px 15px;
  border: 2px solid black;
  background-color: var(--light-gray);
}

.input-container {
  position: relative;
}

.input-container:not(:first-child) {
  margin-top: 25px;
}

input {
  border: none;
}

label {
  position: absolute;
  top: 20%;
  left: 5px;
  font-size: 0.75rem;
  color: gray;
  transition: all 250ms;
}

input:focus + label,
input:valid + label {
  font-size: 0.9rem;
  color: var(--dark);
  transform: translateY(-110%) translateX(-5px);
}

.btns-container {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
}

.btn {
  font-size: 0.75rem;
  padding: 5px;
}
</style>
