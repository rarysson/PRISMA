<template>
  <div>
    <btn-icon v-if="user_logged" @click="set_modal('Open')">
      <i class="fa fa-folder-open-o fa-lg" aria-hidden="true"></i>
      Abrir arquivo
    </btn-icon>
    <btn-icon @click="set_modal('Export')">
      <i class="fa fa-download fa-lg" aria-hidden="true"></i>
      Exportar arquivo
    </btn-icon>
    <btn-icon @click="set_modal('Import')">
      <i class="fa fa-upload fa-lg" aria-hidden="true"></i>
      Importar arquivo
    </btn-icon>

    <component :is="current_modal" v-model="open_modal" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ModalOpenFile from "@/components/Widgets/Modal/ModalOpenFile";
import ModalExportFile from "@/components/Widgets/Modal/ModalExportFile";
import ModalImportFile from "@/components/Widgets/Modal/ModalImportFile";
import BtnIcon from "@/components/Widgets/Btns/BtnIcon";

export default {
  name: "OptionArchive",

  components: {
    ModalOpenFile,
    ModalExportFile,
    ModalImportFile,
    BtnIcon
  },

  data() {
    return {
      open_modal: false,
      current_modal: ""
    };
  },

  computed: {
    ...mapGetters(["user_logged"])
  },

  methods: {
    set_modal(modal) {
      this.current_modal = `Modal${modal}File`;
      this.open_modal = true;
    }
  }
};
</script>
