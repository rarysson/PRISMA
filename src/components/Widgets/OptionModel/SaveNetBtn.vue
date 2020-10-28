<template>
  <div>
    <button @click="save_net">Salvar arquivo</button>
    <p>{{ auto_save_msg }}</p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import db from "@/util/db";
import { sleep } from "@/util/funcs";

export default {
  name: "SaveNetBtn",

  data() {
    return {
      id_interval: null,
      auto_save_msg: "",
      old_net: null
    };
  },

  mounted() {
    const { auto_save, delay } = this.save_config;
    const msg_delay = 500;
    this.old_net = this.net;

    if (auto_save && this.net_name !== null) {
      this.id_interval = setInterval(async () => {
        if (JSON.stringify(this.old_net) !== JSON.stringify(this.net)) {
          this.auto_save_msg = "salvando arquivo...";
          await sleep(msg_delay);
          this.save_net();
          this.old_net = this.net;
          this.auto_save_msg = "arquivo salvo";
          await sleep(msg_delay);
          this.auto_save_msg = "";
        }
      }, delay * 1000 + msg_delay * 2);
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
        try {
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
        } catch (error) {
          console.log(error);
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

div {
  display: inline-block;
}
</style>
