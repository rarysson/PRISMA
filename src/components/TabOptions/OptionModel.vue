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
  </div>
</template>

<script>
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
      }
    };
  },

  watch: {
    current_state() {
      this.$emit("input", this.current_state);
    }
  },

  methods: {
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
  width: 50%;
  display: inline-block;
}

button {
  padding: 15px;
}
</style>
