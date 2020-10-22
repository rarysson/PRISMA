<template>
  <div>
    <button @click="set_modal('Open')">Abrir arquivo</button>
    <button @click="set_modal('Export')">Exportar arquivo</button>
    <button @click="set_modal('Import')">Importar arquivo</button>

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
}
</style>
