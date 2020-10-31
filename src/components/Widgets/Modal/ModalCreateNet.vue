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
import { mapActions } from "vuex";
import db from "@/util/db";
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

    async submit_net_name() {
      try {
        const data = await db.nets.get(this.net_name);

        if (!data) {
          this.set_net_name(this.net_name);
          this.open = false;
        } else {
          console.warn("O nome de rede já existe");
        }
      } catch (error) {
        console.log(error);
      }
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
  top: 25%;
  left: 10px;
  font-size: 1.2rem;
  color: gray;
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
  transform: translateY(-150%);
}

button {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
