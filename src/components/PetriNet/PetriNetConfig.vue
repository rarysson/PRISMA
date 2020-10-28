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
import { mapActions, mapGetters } from "vuex";
import db from "@/util/db";

export default {
  name: "PetriNetConfig",

  data() {
    return {
      auto_save: false,
      delay: 5
    };
  },

  mounted() {
    const { auto_save, delay } = this.save_config;

    this.auto_save = auto_save;
    this.delay = delay;
  },

  computed: {
    ...mapGetters(["save_config"])
  },

  methods: {
    ...mapActions(["set_save_config"]),

    async change_config() {
      const config = { auto_save: this.auto_save, delay: this.delay };

      this.set_save_config(config);

      try {
        const data = await db.configs.get("save");

        if (data) {
          await db.configs.update("save", config);
        } else {
          await db.configs.add({
            name: "save",
            ...config
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
