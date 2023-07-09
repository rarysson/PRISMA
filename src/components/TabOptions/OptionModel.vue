<template>
  <div class="option-model-container">
    <fieldset>
      <legend>{{ $t("OptionModel.insert") }}</legend>

      <btn-icon @click="toggle_state('setting_place', $event)">
        <i class="fa fa-circle-thin fa-lg" aria-hidden="true"></i>
        {{ $t("OptionModel.place") }}
      </btn-icon>
      <btn-icon @click="toggle_state('setting_transition', $event)">
        <i class="fa fa-minus fa-lg fa-rotate-90" aria-hidden="true"></i>
        {{ $t("OptionModel.transition") }}
      </btn-icon>
      <btn-icon @click="toggle_state('setting_arc', $event)">
        <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
        {{ $t("OptionModel.arch") }}
      </btn-icon>
      <btn-icon @click="toggle_state('setting_token', $event)">
        <i class="fa fa-circle" aria-hidden="true"></i>
        {{ $t("OptionModel.token") }}
      </btn-icon>
    </fieldset>

    <fieldset>
      <legend>{{ $t("OptionModel.remove") }}</legend>

      <btn-icon @click="toggle_state('removing_place', $event)">
        <i class="fa fa-circle-thin fa-lg" aria-hidden="true"></i>
        {{ $t("OptionModel.place") }}
      </btn-icon>
      <btn-icon @click="toggle_state('removing_transition', $event)">
        <i class="fa fa-minus fa-lg fa-rotate-90" aria-hidden="true"></i>
        {{ $t("OptionModel.transition") }}
      </btn-icon>
      <btn-icon @click="toggle_state('removing_arc', $event)">
        <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
        {{ $t("OptionModel.arch") }}
      </btn-icon>
      <btn-icon @click="toggle_state('removing_token', $event)">
        <i class="fa fa-circle" aria-hidden="true"></i>
        {{ $t("OptionModel.token") }}
      </btn-icon>
    </fieldset>

    <save-net-btn class="save-net-btn" />
  </div>
</template>

<script>
import SaveNetBtn from "./OptionModel/SaveNetBtn";
import BtnIcon from "@/components/Widgets/Btns/BtnIcon";

export default {
  name: "OptionModel",

  props: {
    value: {
      type: String,
      required: true
    }
  },

  components: {
    SaveNetBtn,
    BtnIcon
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
.option-model-container {
  position: relative;
  width: 100%;
}

fieldset {
  text-align: center;
  padding: 5px;
  width: 350px;
  display: inline-block;
  border-color: var(--dark);
}

fieldset:not(:first-of-type) {
  margin-left: 25px;
}

legend {
  font-size: 0.9rem;
  font-weight: bold;
  margin: 0 10px;
  padding: 0 5px;
}

.save-net-btn {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}

.active {
  color: var(--light);
  background-color: var(--dark);
}
</style>
