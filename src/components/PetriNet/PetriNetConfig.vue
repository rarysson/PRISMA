<template>
  <div>
    <input type="checkbox" name="" id="auto-save" v-model="auto_save" />
    <label for="auto-save">Salvar automaticamente</label>

    <div v-if="auto_save">
      <label for="time">Salvar automáticametente após:</label>
      <input
        type="number"
        id="time"
        min="1"
        max="300"
        v-model.number="delay"
        placeholder="tempo em segundos"
      />
    </div>

    <button @click="change_config">Salvar mudanças</button>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "PetriNetConfig",

  data() {
    return {
      auto_save: false,
      delay: 5
    };
  },

  methods: {
    ...mapActions(["set_save_config"]),

    change_config() {
      this.set_save_config({ auto_save: this.auto_save, delay: this.delay });
    }
  }
};
</script>
