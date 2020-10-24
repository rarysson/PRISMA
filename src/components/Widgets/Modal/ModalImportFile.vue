<template>
  <modal v-model="open">
    <form @submit.prevent="submit_import">
      <input type="file" accept=".prisma" required @change="load_file" />
      <button type="button" @click="open = false">cancelar</button>
      <button type="submit">importar</button>
    </form>
  </modal>
</template>

<script>
import { mapActions } from "vuex";
// import db from "@/util/db";
import Modal from "./Modal";

export default {
  name: "ModalImportFile",

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
      file: null
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
    ...mapActions(["set_net_name", "set_net"]),

    submit_import() {
      const reader = new FileReader();

      reader.readAsText(this.file);

      reader.onload = (event) => {
        this.set_net(JSON.parse(event.target.result));
        this.set_net_name(this.file.name.replace(".prisma", ""));
        this.open = false;
      };

      reader.onerror = () => {
        console.log("Erro ao ler arquivo");
      };
    },

    load_file({ target: { files } }) {
      this.file = files[0];
    }
  }
};
</script>

<style scoped>
/deep/ .modal {
  width: 750px;
  height: 550px;
  background-color: whitesmoke;
  padding: 3%;
}
</style>
