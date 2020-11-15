<template>
  <modal v-model="open">
    <form @submit.prevent="submit_import">
      <label for="file">
        <div
          class="dropzone flex-center"
          @dragover.stop.prevent="handle_drag_event"
          @drop.stop.prevent="handle_drop_event"
        >
          <div v-if="file === null" class="flex-center">
            <i class="fa fa-cloud-upload fa-5x" aria-hidden="true"></i>
            <p>Arraste seu arquivo PRISMA aqui ou clique para procurar</p>
          </div>
          <div v-else class="flex-center">
            <img
              src="@/assets/logo.svg"
              width="100"
              height="100"
              alt="prisma logo"
            />
            <p>{{ file.name }}</p>
          </div>
        </div>
      </label>

      <input type="file" id="file" accept=".prisma" @change="load_file" />

      <div class="btns-container">
        <btn-close @click="close_modal">Cancelar</btn-close>
        <btn-confirm>Confirmar</btn-confirm>
      </div>
    </form>
  </modal>
</template>

<script>
import { mapActions } from "vuex";
import db from "@/util/db";
import Modal from "./Modal";
import BtnClose from "@/components/Widgets/Btns/BtnClose";
import BtnConfirm from "@/components/Widgets/Btns/BtnConfirm";

export default {
  name: "ModalImportFile",

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

      if (this.file !== null) {
        reader.readAsText(this.file);
      } else {
        this.$toast.warning(
          "É necessário a transferência de um arquivo PRISMA para essa ação"
        );
      }

      reader.onload = async (event) => {
        try {
          const data = await db.nets.toArray();
          const names = data.map((i) => i.name);
          const name = this.file.name.replace(".prisma", "");
          const obj = JSON.parse(event.target.result);

          if (names.includes(name)) {
            this.$toast.info(
              "Caso não queira perder os dados da rede antiga, mude o nome do arquivo e importe novamente",
              { duration: 7000 }
            );
            this.$toast.warning("Já existe uma Rede com esse nome", {
              duration: 7000
            });
          }

          this.set_net(obj);
          this.set_paper_dimensions(obj.paper_dimensions);
          this.set_net_name(name);
          this.open = false;
        } catch (error) {
          this.$toast.error(error);
        }
      };

      reader.onerror = () => {
        this.$toast.error("Erro ao ler arquivo");
      };
    },

    load_file({ target: { files } }) {
      this.file = files[0];
    },

    handle_drop_event(event) {
      const file = event.dataTransfer.files[0];

      if (file.name.endsWith(".prisma")) {
        this.file = file;
      } else {
        this.$toast.warning("Só é possível ler arquivos .prisma");
      }
    },

    handle_drag_event(event) {
      event.dataTransfer.dropEffect = "copy";
    },

    close_modal() {
      this.open = false;
      this.file = null;
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

form {
  position: relative;
  height: 100%;
}

#file {
  position: absolute;
  z-index: -1;
  opacity: 0;
}

.dropzone {
  width: 100%;
  height: 75%;
  border: 2px dashed black;
  cursor: pointer;
  transition: background-color 250ms;
}

.dropzone:hover {
  background-color: var(--light-gray);
}

.btns-container {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
}

.flex-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
