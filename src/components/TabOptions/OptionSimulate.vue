<template>
  <div>
    <button @click="$emit('change', { type: 'backward', steps: 1 })">
      <i class="fa fa-angle-left fa-lg" aria-hidden="true"></i>
      Desfazer passo
    </button>
    <button @click="$emit('change', { type: 'forward', steps: 1 })">
      <i class="fa fa-angle-right fa-lg" aria-hidden="true"></i>
      Refazer passo
    </button>
    <button @click="set_simulation_type('backward')">
      <i class="fa fa-angle-double-left fa-lg" aria-hidden="true"></i>
      Voltar simulação
    </button>
    <button @click="set_simulation_type('forward')">
      <i class="fa fa-angle-double-right fa-lg" aria-hidden="true"></i>
      Avançar simulação
    </button>

    <modal-simulation v-model="open_modal" @change="emit_config" />
  </div>
</template>

<script>
import ModalSimulation from "@/components/Widgets/Modal/ModalSimulation";

export default {
  name: "OptionSimulate",

  components: {
    ModalSimulation
  },

  data() {
    return {
      open_modal: false,
      simulation_type: ""
    };
  },

  methods: {
    set_simulation_type(type) {
      this.simulation_type = type;
      this.open_modal = true;
    },

    emit_config({ steps, skip_animation }) {
      const time = skip_animation ? 0 : 500;
      this.open_modal = false;

      this.$emit("change", { type: this.simulation_type, steps, time });
    }
  }
};
</script>

<style scoped>
button {
  padding: 15px;
  border: none;
  background-color: white;
}

button:hover {
  outline: 1px solid black;
}

button:not(:first-child) {
  margin-left: 15px;
}

button i {
  display: block;
  margin-bottom: 3px;
}
</style>
