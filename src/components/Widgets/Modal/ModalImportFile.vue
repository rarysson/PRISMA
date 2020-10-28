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
import db from "@/util/db";
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
    ...mapActions(["set_net_name", "set_net", "set_paper_dimensions"]),

    submit_import() {
      const reader = new FileReader();

      reader.readAsText(this.file);

      reader.onload = async (event) => {
        try {
          const data = await db.nets.toArray();
          const names = data.map((i) => i.name);
          const name = this.file.name.replace(".prisma", "");
          const obj = JSON.parse(event.target.result);

          if (names.includes(name)) {
            console.warn(
              `Já existe uma Rede com esse nome.
              Caso não queira perder os dados da rede antiga, mude o nome do arquivo e importe novamente.`
            );
          }

          this.set_net(obj);
          this.set_paper_dimensions(obj.paper_dimensions);
          this.set_net_name(name);
          this.open = false;
        } catch (error) {
          console.log(error);
        }
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
