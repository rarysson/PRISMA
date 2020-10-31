<template>
  <div>
    <button @click="set_modal('Open')">
      <i class="fa fa-folder-open-o fa-lg" aria-hidden="true"></i>
      Abrir arquivo
    </button>
    <button @click="set_modal('Export')">
      <i class="fa fa-download fa-lg" aria-hidden="true"></i>
      Exportar arquivo
    </button>
    <button @click="set_modal('Import')">
      <i class="fa fa-upload fa-lg" aria-hidden="true"></i>
      Importar arquivo
    </button>

    <component :is="current_modal" v-model="open_modal" />
  </div>
</template>

<script>
import ModalOpenFile from "@/components/Widgets/Modal/ModalOpenFile";
import ModalExportFile from "@/components/Widgets/Modal/ModalExportFile";
import ModalImportFile from "@/components/Widgets/Modal/ModalImportFile";

export default {
  name: "OptionArchive",

  components: {
    ModalOpenFile,
    ModalExportFile,
    ModalImportFile
  },

  data() {
    return {
      open_modal: false,
      current_modal: ""
    };
  },

  methods: {
    set_modal(modal) {
      this.current_modal = `Modal${modal}File`;
      this.open_modal = true;
    }
  }
};
</script>

<style scoped>
button {
  padding: 15px;
  border: none;
  background-color: white;
}

button:hover {
  outline: 1px solid black;
}

button:not(:first-child) {
  margin-left: 15px;
}

button i {
  display: block;
  margin-bottom: 3px;
}
</style>
