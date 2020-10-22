<template>
  <div class="page-container">
    <v-tabs @change="current_tab = $event" :selected="current_tab">
      <v-tab title="Arquivo">
        <option-archive />
      </v-tab>
      <v-tab title="Modelar">
        <option-model v-model="current_state" />
      </v-tab>
      <v-tab title="Simular">
        <option-simulate />
      </v-tab>
    </v-tabs>

    <component :is="current_component" :current-state="current_state" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import VTabs from "@/components/Widgets/VTab/VTabs";
import VTab from "@/components/Widgets/VTab/VTab";
import OptionModel from "@/components/TabOptions/OptionModel";
import OptionSimulate from "@/components/TabOptions/OptionSimulate";
import OptionArchive from "@/components/TabOptions/OptionArchive";
import PetriNetModel from "@/components/PetriNet/PetriNetModel";
import PetriNetSimulate from "@/components/PetriNet/PetriNetSimulate";
import PetriNetArchive from "@/components/PetriNet/PetriNetArchive";

export default {
  name: "Home",

  components: {
    VTabs,
    VTab,
    OptionModel,
    OptionSimulate,
    OptionArchive,
    PetriNetModel,
    PetriNetSimulate,
    PetriNetArchive
  },

  data() {
    return {
      current_state: "",
      current_tab: "",
      current_component: "PetriNetArchive"
    };
  },

  computed: {
    ...mapGetters(["net_name"])
  },

  watch: {
    net_name() {
      this.current_tab = "Modelar";
    },

    current_tab() {
      this.current_component = this.get_current_component();
    }
  },

  methods: {
    get_current_component() {
      switch (this.current_tab) {
        case "Arquivo":
          return "PetriNetArchive";
        case "Modelar":
          return "PetriNetModel";
        case "Simular":
          return "PetriNetSimulate";
        default:
          return "";
      }
    }
  }
};
</script>
