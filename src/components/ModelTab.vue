<template>
  <div>
    <fieldset class="menu">
      <legend>INSERIR</legend>
      <button
        :class="{ active: states.setting_place }"
        @click="toggle_state('setting_place')"
      >
        LUGAR
      </button>
      <button
        :class="{ active: states.setting_transition }"
        @click="toggle_state('setting_transition')"
      >
        TRANSIÇÃO
      </button>
      <button
        :class="{ active: states.setting_arc }"
        @click="toggle_state('setting_arc')"
      >
        ARCO
      </button>
      <button
        :class="{ active: states.setting_token }"
        @click="toggle_state('setting_token')"
      >
        FICHA
      </button>
    </fieldset>
    <fieldset class="menu">
      <legend>REMOVER</legend>
      <button
        :class="{ active: states.removing_place }"
        @click="toggle_state('removing_place')"
      >
        LUGAR
      </button>
      <button
        :class="{ active: states.removing_transition }"
        @click="toggle_state('removing_transition')"
      >
        TRANSIÇÃO
      </button>
      <button
        :class="{ active: states.removing_arc }"
        @click="toggle_state('removing_arc')"
      >
        ARCO
      </button>
      <button
        :class="{ active: states.removing_token }"
        @click="toggle_state('removing_token')"
      >
        FICHA
      </button>
    </fieldset>
  </div>
</template>

<script>
export default {
  name: "ModelTab",

  props: {
    value: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      current_state: this.value,
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
    toggle_state(state) {
      for (const key in this.states) {
        if (key === state) {
          this.states[key] = !this.states[key];
          this.current_state = this.states[key] ? key : "";
        } else {
          this.states[key] = false;
        }
      }
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
