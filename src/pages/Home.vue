<template>
  <div class="page-container">
    <v-tabs @change="current_tab = $event">
      <v-tab title="Modelar">
        <option-model v-model="current_state" />
      </v-tab>
      <v-tab title="Simular">
        <option-simulate />
      </v-tab>
    </v-tabs>

    <petri-net-model
      v-if="current_tab === 'Modelar'"
      :current-state="current_state"
    />
    <petri-net-simulate v-else-if="current_tab === 'Simular'" />
  </div>
</template>

<script>
import VTabs from "@/components/Widgets/VTab/VTabs";
import VTab from "@/components/Widgets/VTab/VTab";
import OptionModel from "@/components/TabOptions/OptionModel";
import OptionSimulate from "@/components/TabOptions/OptionSimulate";
import PetriNetModel from "@/components/PetriNet/PetriNetModel";
import PetriNetSimulate from "@/components/PetriNet/PetriNetSimulate";

export default {
  name: "Home",

  components: {
    VTabs,
    VTab,
    OptionModel,
    OptionSimulate,
    PetriNetModel,
    PetriNetSimulate
  },

  data() {
    return {
      current_state: "",
      current_tab: ""
    };
  }
};
</script>
