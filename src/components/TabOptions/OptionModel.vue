<template>
  <div>
    <fieldset class="menu">
      <legend>INSERIR</legend>
      <button @click="toggle_state('setting_place', $event)">
        LUGAR
      </button>
      <button @click="toggle_state('setting_transition', $event)">
        TRANSIÇÃO
      </button>
      <button @click="toggle_state('setting_arc', $event)">
        ARCO
      </button>
      <button @click="toggle_state('setting_token', $event)">
        FICHA
      </button>
    </fieldset>
    <fieldset class="menu">
      <legend>REMOVER</legend>
      <button @click="toggle_state('removing_place', $event)">
        LUGAR
      </button>
      <button @click="toggle_state('removing_transition', $event)">
        TRANSIÇÃO
      </button>
      <button @click="toggle_state('removing_arc', $event)">
        ARCO
      </button>
      <button @click="toggle_state('removing_token', $event)">
        FICHA
      </button>
    </fieldset>

    <button @click="save_net">Salvar arquivo</button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import db from "@/util/db";

export default {
  name: "OptionModel",

  props: {
    value: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      current_state: this.value,
      last_element: null,
      states: {
        setting_place: false,
        setting_transition: false,
        setting_arc: false,
        setting_token: false,
        removing_place: false,
        removing_transition: false,
        removing_arc: false,
        removing_token: false
      },
      id_interval: null
    };
  },

  watch: {
    current_state() {
      this.$emit("input", this.current_state);
    },

    save_config() {
      const { auto_save, delay } = this.save_config;

      if (auto_save) {
        this.id_interval = setInterval(() => {
          console.log("salvando automaticamente");
          this.save_net();
        }, delay * 1000);
      } else {
        clearInterval(this.id_interval);
      }
    }
  },

  computed: {
    ...mapGetters(["is_net_empty", "net", "net_name", "save_config"])
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
            net: this.net
          });
        } else {
          await db.nets.add({
            name: this.net_name,
            last_update: Date.now(),
            net: this.net
          });
        }
      }

      this.request_net_update(false);
    },

    toggle_state(state, event) {
      this.last_element?.classList.remove("active");
      event.target.classList.add("active");

      for (const key in this.states) {
        if (key === state) {
          this.states[key] = !this.states[key];

          if (this.states[key]) {
            this.current_state = key;
          } else {
            this.current_state = "";
            event.target.classList.remove("active");
          }
        } else {
          this.states[key] = false;
        }
      }

      this.last_element = event.target;
    }
  }
};
</script>

<style scoped>
.active {
  border: 2px solid black;
}

.menu {
  text-align: center;
  padding-top: 20px;
  width: 45%;
  display: inline-block;
}

button {
  padding: 15px;
}
</style>
