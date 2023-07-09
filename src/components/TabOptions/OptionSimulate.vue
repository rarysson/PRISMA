<template>
  <div>
    <btn-icon @click="$emit('change', { type: 'backward', steps: 1 })">
      <i class="fa fa-angle-left fa-lg" aria-hidden="true"></i>
      {{ $t("OptionSimulate.undo") }}
    </btn-icon>
    <btn-icon @click="$emit('change', { type: 'forward', steps: 1 })">
      <i class="fa fa-angle-right fa-lg" aria-hidden="true"></i>
      {{ $t("OptionSimulate.redo") }}
    </btn-icon>
    <btn-icon @click="set_simulation_type('backward')">
      <i class="fa fa-angle-double-left fa-lg" aria-hidden="true"></i>
      {{ $t("OptionSimulate.backward") }}
    </btn-icon>
    <btn-icon @click="set_simulation_type('forward')">
      <i class="fa fa-angle-double-right fa-lg" aria-hidden="true"></i>
      {{ $t("OptionSimulate.forward") }}
    </btn-icon>

    <modal-simulation v-model="open_modal" @change="emit_config" />
  </div>
</template>

<script>
import ModalSimulation from "@/components/Widgets/Modal/ModalSimulation";
import BtnIcon from "@/components/Widgets/Btns/BtnIcon";

export default {
  name: "OptionSimulate",

  components: {
    ModalSimulation,
    BtnIcon
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
