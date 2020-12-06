<template>
  <modal v-model="open">
    <form @submit.prevent="submit_net_name">
      <div class="input-container">
        <input id="net-name" v-model.trim="net_name" type="text" required />
        <label for="net-name">Nome da rede</label>
      </div>

      <btn-confirm>Confirmar</btn-confirm>
    </form>
  </modal>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Modal from "./Modal";
import BtnConfirm from "@/components/Widgets/Btns/BtnConfirm";

export default {
  name: "ModalCreateNet",

  props: {
    value: {
      type: Boolean,
      required: true
    }
  },

  components: {
    Modal,
    BtnConfirm
  },

  data() {
    return {
      open: this.value,
      net_name: null
    };
  },

  computed: {
    ...mapGetters(["user"])
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
    ...mapActions(["set_net_name"]),

    submit_net_name() {
      this.set_net_name(this.net_name);
      this.open = false;
    }
  }
};
</script>

<style scoped>
/deep/ .modal {
  width: 500px;
  height: 200px;
  background-color: whitesmoke;
  padding: 2%;
}

form {
  position: relative;
  height: 100%;
}

.input-container {
  position: relative;
  margin-top: 15px;
}

label {
  position: absolute;
  top: 50%;
  left: 10px;
  font-size: 1.2rem;
  color: gray;
  transform: translateY(-50%);
  transition: all 250ms;
}

input {
  width: 75%;
  padding: 10px;
  border: none;
  border-radius: 5px;
}

input:focus + label,
input:valid + label {
  font-size: 1rem;
  color: var(--dark);
  transform: translateY(-200%);
}

button {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
