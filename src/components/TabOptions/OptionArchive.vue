<template>
  <div>
    <button @click="open_modal = true">Abrir arquivo</button>
    <modal-open-file v-model="open_modal" />
  </div>
</template>

<script>
import ModalOpenFile from "@/components/Widgets/Modal/ModalOpenFile";

export default {
  name: "OptionArchive",

  components: {
    ModalOpenFile
  },

  data() {
    return {
      open_modal: false
    };
  }
};
</script>

<style scoped>
button {
  padding: 15px;
}
</style>
