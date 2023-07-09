<template>
  <modal v-model="open">
    <div class="content-container">
      <button class="btn-export" @click="export_file">
        {{ $t("ModalExportFile.export") }}
      </button>
      <btn-close class="btn-close" @click="open = false">
        {{ $t("ModalExportFile.cancel") }}
      </btn-close>
    </div>
  </modal>
</template>

<script>
import * as file_saver from "file-saver";
import { mapGetters } from "vuex";
import Modal from "./Modal";
import BtnClose from "@/components/Widgets/Btns/BtnClose";

export default {
  name: "ModalExportFile",

  props: {
    value: {
      type: Boolean,
      required: true
    }
  },

  components: {
    Modal,
    BtnClose
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
        this.open = false;
      } else {
        this.$toast.warning(this.$t("ModalExportFile.warning"));
      }
    }
  }
};
</script>

<style scoped>
/deep/ .modal {
  width: 500px;
  height: 300px;
  background-color: whitesmoke;
  padding: 2%;
}

.content-container {
  position: relative;
  height: 100%;
}

button {
  padding: 10px 20px;
  border-radius: 5px;
}

.btn-export {
  border: 1px solid var(--dark);
  color: var(--light);
  background-color: var(--dark);
}

.btn-export:hover {
  color: var(--dark);
  background-color: var(--light);
}

.btn-close {
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
