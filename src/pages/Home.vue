<template>
  <div class="page-container">
    <header>
      <v-tabs
        class="tabs"
        :selected="current_tab"
        @change="current_tab = $event"
      >
        <v-tab title="Arquivo">
          <option-archive />
        </v-tab>
        <v-tab title="Modelar">
          <option-model v-model="current_state" />
        </v-tab>
        <v-tab title="Simular">
          <option-simulate @change="change_net_state" />
        </v-tab>
        <v-tab v-if="user_logged" title="Configurações">
          <option-configs />
        </v-tab>
      </v-tabs>

      <div class="user-container">
        <div class="user">
          <i class="fa fa-user-circle-o user-icon" aria-hidden="true"></i>
          <i class="fa fa-angle-down" aria-hidden="true"></i>
        </div>

        <ul v-if="!user_logged" class="dropdown-list">
          <li class="dropdown-list-item">
            <router-link to="/login">
              <button>Fazer login</button>
            </router-link>
          </li>
          <li class="dropdown-list-item">
            <router-link to="/registration">
              <button>Cadastrar</button>
            </router-link>
          </li>
        </ul>

        <ul v-else class="dropdown-list">
          <li class="dropdown-list-item">
            <router-link to="/user">
              <button>Editar perfil</button>
            </router-link>
          </li>
          <li class="dropdown-list-item">
            <button @click="disconnect">Deslogar</button>
          </li>
        </ul>
      </div>
    </header>

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
import api from "@/util/api";
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

  async beforeMount() {
    if (this.user_logged) {
      const response = await api.get(`/${this.user.id}/config`);
      const data = response.data;
      if (data) {
        const { auto_save, delay } = data.save;

        this.set_save_config({ auto_save, delay });
      }
    }
  },

  computed: {
    ...mapGetters(["net_name", "user_logged", "user"])
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
    ...mapActions(["set_save_config", "log_out"]),

    get_current_component() {
      switch (this.current_tab) {
        case "Arquivo":
          return "PetriNetArchive";
        case "Modelar":
          return "PetriNetModel";
        case "Simular":
          return "PetriNetSimulate";
        case "Configurações":
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
    },

    disconnect() {
      this.log_out();
      this.$toast.success("Usuário deslogado");
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

header {
  width: 100%;
  display: flex;
  align-items: center;
}

.tabs {
  width: inherit;
  position: relative;
  z-index: 99;
  background-color: whitesmoke;
}

.net-component {
  flex: auto;
}

.user-container {
  position: relative;
}

.user {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 40px;
  padding: 10px 20px 10px 0;
}

.user-icon {
  width: 40px;
  height: 40px;
}

.dropdown-list {
  position: absolute;
  bottom: 0;
  right: 20px;
  z-index: -1;
  width: max-content;
  padding: 15px 20px;
  opacity: 0;
  margin-top: 10px;
  border: 1px solid black;
  transform: translateY(90%);
  background-color: white;
}

.dropdown-list::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 10px;
  margin-top: -10px;
}

.user-container:hover .dropdown-list {
  opacity: 1;
  z-index: 999;
}

.dropdown-list-item {
  display: block;
  width: 100%;
}

.dropdown-list-item:not(:last-of-type) {
  margin-bottom: 10px;
}

button {
  width: 100%;
  padding: 10px 20px;
  border-radius: 5px;
  border: 1px solid var(--dark);
  color: var(--light);
  background-color: var(--dark);
}

button:hover {
  color: var(--dark);
  background-color: var(--light);
}
</style>
