<template>
  <div class="config-net">
    <article>
      <h2>Arquivos</h2>
      <hr />

      <input type="checkbox" id="auto-save" v-model="auto_save" />
      <label for="auto-save">Salvar automaticamente</label>

      <div v-if="auto_save" class="delay-option">
        <label for="time">Delay do auto salvamento</label>
        <br />
        <input
          type="number"
          id="time"
          min="1"
          max="300"
          v-model.number="delay"
        />
        <label for="time">segundo(s)</label>
      </div>
    </article>

    <btn-confirm class="btn-confirm" @click="change_config"
      >Salvar mudanças</btn-confirm
    >
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import db from "@/util/db";
import BtnConfirm from "@/components/Widgets/Btns/BtnConfirm";

export default {
  name: "PetriNetConfig",

  components: {
    BtnConfirm
  },

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
        this.$toast.error(error);
      }
    }
  }
};
</script>

<style scoped>
.config-net {
  position: relative;
  margin: 10px 50px 50px;
  padding: 10px 20px;
  background-color: white;
}

hr {
  color: var(--light-gray);
  margin-bottom: 20px;
}

#auto-save {
  margin-right: 10px;
}

.delay-option {
  margin-top: 10px;
  margin-left: 25px;
}

#time {
  width: 50px;
  text-align: center;
  margin-top: 5px;
}

#time + label {
  margin-left: 5px;
}

.btn-confirm {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>
