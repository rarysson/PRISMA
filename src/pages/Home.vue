<template>
  <div class="page-container">
    <v-tabs>
      <v-tab title="Modelar">
        <option-model v-model="current_state" />
      </v-tab>
      <v-tab title="Simular">
        <option-simulate />
      </v-tab>
    </v-tabs>

    <joint-paper
      @mounted="graph = $event"
      @blank-click="set_object"
      @element-click="handle_element_click"
      @element-contextmenu="handle_element_contextmenu"
    >
      <div v-if="graph !== null" hidden>
        <joint-place
          v-for="place in places"
          :key="place.key"
          :graph="graph"
          :attrs="place"
          @mounted="place.id = $event"
        />
        <joint-transition
          v-for="transition in transitions"
          :key="transition.key"
          :graph="graph"
          :attrs="transition"
          @mounted="transition.id = $event"
        />
        <joint-arc
          v-for="arc in arcs"
          :key="arc.link_id"
          :graph="graph"
          :attrs="arc"
          @mounted="arc.id = $event"
        />
      </div>
      <template #overlay-elements>
        <context-menu
          :data="tmp_element"
          :position="context_menu_position"
          @update="update_element"
        />
      </template>
    </joint-paper>
  </div>
</template>

<script>
import JointPaper from "@/components/Joint/JointPaper";
import JointPlace from "@/components/Joint/JointPlace";
import JointTransition from "@/components/Joint/JointTransition";
import JointArc from "@/components/Joint/JointArc";
import VTabs from "@/components/Widgets/VTab/VTabs";
import VTab from "@/components/Widgets/VTab/VTab";
import OptionModel from "@/components/TabOptions/OptionModel";
import OptionSimulate from "@/components/TabOptions/OptionSimulate";
import ContextMenu from "@/components/Widgets/Joint/ContextMenu";

export default {
  name: "Home",

  components: {
    JointPaper,
    JointPlace,
    JointTransition,
    JointArc,
    VTabs,
    VTab,
    OptionModel,
    OptionSimulate,
    ContextMenu
  },

  data() {
    return {
      graph: null,
      places: [],
      place_id: 0,
      transitions: [],
      transition_id: 0,
      arcs: [],
      tmp_arc: [],
      tmp_element: null,
      current_state: "",
      context_menu_position: { x: 0, y: 0 },
      element_names: {
        names: [],
        need_update: true
      }
    };
  },

  methods: {
    set_object({ x, y }) {
      if (this.current_state === "setting_place") {
        this.places.push({
          key: `P${this.place_id}`,
          name: `Place ${this.place_id++}`,
          position: { x, y },
          tokens: 0
        });
      } else if (this.current_state === "setting_transition") {
        this.transitions.push({
          key: `T${this.transition_id}`,
          name: `Transition ${this.transition_id++}`,
          position: { x, y }
        });
      }
    },

    set_arc(id, type) {
      this.tmp_arc.push({ id, type });

      if (this.tmp_arc.length === 2) {
        const source = this.tmp_arc[0];
        const target = this.tmp_arc[1];

        if (source.type !== target.type) {
          const has_arc = this.arcs.some(
            (arc) => arc.source === source.id && arc.target === target.id
          );

          if (!has_arc) {
            this.arcs.push({
              link_id: source.id + target.id,
              source: source.id,
              target: target.id,
              weight: 1
            });
          }
        }

        this.tmp_arc = [];
      }
    },

    change_token(id) {
      const place = this.places.find((place) => place.id === id);

      if (this.current_state === "setting_token") {
        place.tokens++;
      } else if (this.current_state === "removing_token" && place.tokens > 0) {
        place.tokens--;
      }
    },

    handle_element_click({ id, type }) {
      if (this.current_state === "setting_arc") {
        this.set_arc(id, type);
      } else if (this.current_state.includes("token")) {
        this.change_token(id);
      } else if (this.current_state.includes("removing")) {
        const key = `${type}s`;
        const index = this[key].findIndex((el) => el.id === id);
        this.arcs = this.arcs.filter(
          (arc) => arc.source !== id && arc.target !== id
        );

        this[key].splice(index, 1);
      }
    },

    handle_element_contextmenu({ id, type, position }) {
      const key = `${type}s`;
      const index = this[key].findIndex((el) => el.id === id);
      this.tmp_element = { index, type, ...this[key][index] };
      this.context_menu_position = position;
    },

    reset_list_name() {
      this.element_names.names = [];
      this.element_names.names.push(...this.places.map((p) => p.name));
      this.element_names.names.push(...this.transitions.map((t) => t.name));
    },

    update_element() {
      const type_key = `${this.tmp_element.type}s`;
      const element = this[type_key][this.tmp_element.index];

      for (const key in element) {
        if (key === "name") {
          if (this.element_names.need_update) {
            this.reset_list_name();
          }

          if (element.name !== this.tmp_element.name) {
            if (!this.element_names.names.includes(this.tmp_element.name)) {
              element.name = this.tmp_element.name;
              this.element_names.need_update = true;
            } else {
              this.element_names.need_update = false;
            }
          }
        } else {
          element[key] = this.tmp_element[key];
        }
      }

      this.tmp_element = null;
    }
  }
};
</script>
