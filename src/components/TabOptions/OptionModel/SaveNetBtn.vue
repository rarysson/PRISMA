<template>
  <div class="save-container">
    <btn-icon @click="save_net">
      <i class="fa fa-floppy-o fa-lg" aria-hidden="true"></i>
      Salvar arquivo
    </btn-icon>
    <i
      v-show="saving"
      class="save-style fa fa-sync fa-spin"
      aria-hidden="true"
    ></i>
    <i v-show="done" class="save-style fa fa-check" aria-hidden="true"></i>
    <p>{{ save_msg }}</p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import db from "@/util/db";
import { sleep } from "@/util/funcs";
import BtnIcon from "@/components/Widgets/Btns/BtnIcon";

export default {
  name: "SaveNetBtn",

  components: {
    BtnIcon
  },

  data() {
    return {
      id_interval: null,
      save_msg: "",
      old_net: null,
      saving: false,
      done: false,
      msg_delay: 500
    };
  },

  mounted() {
    const { auto_save, delay } = this.save_config;
    this.old_net = this.net;

    if (auto_save && this.net_name !== null) {
      this.id_interval = setInterval(async () => {
        this.request_net_update(true);
        // Delay para o sistema conseguir atualizar a rede
        await sleep(100);

        if (JSON.stringify(this.old_net) !== JSON.stringify(this.net)) {
          this.save_msg = "salvando arquivo...";
          this.saving = true;
          await sleep(this.msg_delay);
          this.saving = false;
          this.save_net();
          this.old_net = this.net;
        }

        this.request_net_update(false);
      }, delay * 1000 + this.msg_delay * 2);
    } else {
      clearInterval(this.id_interval);
    }
  },

  beforeDestroy() {
    clearInterval(this.id_interval);
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

          this.save_msg = "arquivo salvo!";
          this.done = true;
          await sleep(this.msg_delay);
          this.save_msg = "";
          this.done = false;
          await sleep(this.msg_delay);
        } catch (error) {
          this.$toast.error(error);
        }
      }

      this.request_net_update(false);
    }
  }
};
</script>

<style scoped>
.save-container {
  position: relative;
}

p {
  position: absolute;
  bottom: -15px;
  right: 10px;
  font-size: 0.75rem;
  font-style: italic;
}

.save-style {
  position: absolute;
  top: 25%;
  right: 25%;
}

.fa-sync {
  color: var(--blue);
}

.fa-check {
  color: var(--success);
}
</style>
