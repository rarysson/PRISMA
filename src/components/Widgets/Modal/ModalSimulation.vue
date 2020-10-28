<template>
  <modal v-model="open">
    <form @submit.prevent="submit">
      <label for="steps">Insira o número de passos</label>
      <input type="number" id="steps" min="1" v-model.number="steps" required />

      <input type="checkbox" id="skip" v-model="skip_animation" />
      <label for="skip">Desativar animação durante o processo</label>

      <button type="button" @click="open = false">cancelar</button>
      <button type="submit">confirmar</button>
    </form>
  </modal>
</template>

<script>
import Modal from "./Modal";

export default {
  name: "ModalSimulation",

  props: {
    value: {
      type: Boolean,
      required: true
    }
  },

  components: {
    Modal
  },

  data() {
    return {
      open: this.value,
      steps: 1,
      skip_animation: false
    };
  },

  watch: {
    value() {
      this.open = this.value;
    },

    open() {
      this.$emit("input", this.open);
    }
  },

  methods: {
    submit() {
      this.$emit("change", {
        steps: this.steps,
        skip_animation: this.skip_animation
      });
    }
  }
};
</script>

<style scoped>
/deep/ .modal {
  width: 550px;
  height: 350px;
  background-color: whitesmoke;
  padding: 3%;
}
</style>
