<template>
  <button @click="save_net">Salvar arquivo</button>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import db from "@/util/db";

export default {
  name: "SaveNetBtn",

  data() {
    return {
      id_interval: null
    };
  },

  mounted() {
    const { auto_save, delay } = this.save_config;

    if (auto_save) {
      this.id_interval = setInterval(() => {
        console.log("salvando automaticamente");
        this.save_net();
      }, delay * 1000);
    } else {
      clearInterval(this.id_interval);
    }
  },

  computed: {
    ...mapGetters([
      "is_net_empty",
      "net",
      "net_name",
      "save_config",
      "paper_dimensions"
    ])
  },

  methods: {
    ...mapActions(["request_net_update"]),

    async save_net() {
      this.request_net_update(true);

      if (this.net_name !== null) {
        const data = await db.nets.get(this.net_name);

        if (data) {
          await db.nets.update(this.net_name, {
            last_update: Date.now(),
            net: this.net,
            paper_dimensions: this.paper_dimensions
          });
        } else {
          await db.nets.add({
            name: this.net_name,
            last_update: Date.now(),
            net: this.net,
            paper_dimensions: this.paper_dimensions
          });
        }
      }

      this.request_net_update(false);
    }
  }
};
</script>

<style scoped>
button {
  padding: 15px;
}
</style>
