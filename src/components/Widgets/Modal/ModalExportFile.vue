<template>
  <modal v-model="open">
    <form @submit.prevent="export_file">
      <button type="button" @click="open = false">cancelar</button>
      <button type="submit">Exportar como .prisma</button>
    </form>
  </modal>
</template>

<script>
import * as file_saver from "file-saver";
import { mapGetters } from "vuex";
import Modal from "./Modal";

export default {
  name: "ModalExportFile",

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
      open: this.value
    };
  },

  computed: {
    ...mapGetters(["is_net_empty", "net", "net_name", "paper_dimensions"])
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
    export_file() {
      if (!this.is_net_empty) {
        const file = new File(
          [
            JSON.stringify({
              ...this.net,
              paper_dimensions: this.paper_dimensions
            })
          ],
          `${this.net_name}.prisma`,
          { type: "text/json;charset=utf-8" }
        );

        file_saver.saveAs(file);
      }

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
  padding: 3%;
}
</style>
