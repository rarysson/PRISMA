<template>
  <div class="page-container">
    <v-tabs class="tabs" :selected="current_tab" @change="current_tab = $event">
      <v-tab :title="$t('Home.file')">
        <option-archive />
      </v-tab>
      <v-tab :title="$t('Home.model')">
        <option-model v-model="current_state" />
      </v-tab>
      <v-tab :title="$t('Home.simulate')">
        <option-simulate @change="change_net_state" />
      </v-tab>
      <v-tab :title="$t('Home.settings')">
        <option-configs />
      </v-tab>
    </v-tabs>

    <component
      class="net-component"
      :is="current_component"
      :current-state="current_state"
      ref="net"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import db from "@/util/db";
import VTabs from "@/components/Widgets/VTab/VTabs";
import VTab from "@/components/Widgets/VTab/VTab";
import OptionModel from "@/components/TabOptions/OptionModel";
import OptionSimulate from "@/components/TabOptions/OptionSimulate";
import OptionArchive from "@/components/TabOptions/OptionArchive";
import OptionConfigs from "@/components/TabOptions/OptionConfigs";
import PetriNetModel from "@/components/PetriNet/PetriNetModel";
import PetriNetSimulate from "@/components/PetriNet/PetriNetSimulate";
import PetriNetArchive from "@/components/PetriNet/PetriNetArchive";
import PetriNetConfig from "@/components/PetriNet/PetriNetConfig";

export default {
  name: "Home",

  components: {
    VTabs,
    VTab,
    OptionModel,
    OptionSimulate,
    OptionArchive,
    OptionConfigs,
    PetriNetModel,
    PetriNetSimulate,
    PetriNetArchive,
    PetriNetConfig
  },

  data() {
    return {
      current_state: "",
      current_tab: "",
      current_component: "PetriNetArchive"
    };
  },

  async mounted() {
    const data = await db.configs.get("save");

    if (data) {
      const { auto_save, delay } = data;

      this.set_save_config({ auto_save, delay });
    }
  },

  computed: {
    ...mapGetters(["net_name"])
  },

  watch: {
    net_name() {
      this.current_tab = this.$t("Home.model");
    },

    current_tab() {
      this.current_component = this.get_current_component();
    }
  },

  methods: {
    ...mapActions(["set_save_config"]),

    get_current_component() {
      switch (this.current_tab) {
        case this.$t("Home.file"):
          return "PetriNetArchive";
        case this.$t("Home.model"):
          return "PetriNetModel";
        case this.$t("Home.simulate"):
          return "PetriNetSimulate";
        case this.$t("Home.settings"):
          return "PetriNetConfig";
        default:
          return "";
      }
    },

    change_net_state(data) {
      if (data.type === "forward" && data.steps > 1) {
        this.$refs.net.random_state(data);
      } else {
        this.$refs.net.revert_net_state(data);
      }
    }
  }
};
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.tabs {
  position: relative;
  z-index: 99;
  background-color: whitesmoke;
}

.net-component {
  flex: auto;
}
</style>
