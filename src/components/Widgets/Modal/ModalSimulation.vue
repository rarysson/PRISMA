<template>
  <modal v-model="open">
    <form @submit.prevent="submit">
      <label for="steps">Insira o número de passos</label>
      <br />
      <input type="number" id="steps" min="1" v-model.number="steps" required />
      <br />

      <input type="checkbox" id="skip" v-model="skip_animation" />
      <label for="skip">Desativar animação durante o processo</label>

      <div class="btns-container">
        <btn-close @click="close_modal">Cancelar</btn-close>
        <btn-confirm>Confirmar</btn-confirm>
      </div>
    </form>
  </modal>
</template>

<script>
import Modal from "./Modal";
import BtnClose from "@/components/Widgets/Btns/BtnClose";
import BtnConfirm from "@/components/Widgets/Btns/BtnConfirm";

export default {
  name: "ModalSimulation",

  props: {
    value: {
      type: Boolean,
      required: true
    }
  },

  components: {
    Modal,
    BtnClose,
    BtnConfirm
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
    },

    close_modal() {
      this.open = false;
      this.steps = 1;
      this.skip_animation = false;
    }
  }
};
</script>

<style scoped>
/deep/ .modal {
  width: 400px;
  height: 250px;
  background-color: whitesmoke;
  padding: 1.5% 1%;
}

form {
  position: relative;
  height: 100%;
  padding-top: 25px;
  text-align: center;
}

#steps {
  width: 20%;
  margin: 10px 0 25px;
  border: none;
  text-align: center;
}

#skip {
  margin-right: 10px;
}

.btns-container {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
}
</style>
