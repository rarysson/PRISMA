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
      @mounted="set_graph"
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
        <form
          v-if="tmp_element !== null"
          :style="{
            position: 'absolute',
            top: `${y}px`,
            left: `${x}px`,
            border: '1px solid black',
            backgroundColor: 'white'
          }"
        >
          <input
            v-show="tmp_element.name !== undefined"
            type="text"
            v-model="tmp_element.name"
          />
          <br />
          <input
            v-show="tmp_element.tokens !== undefined"
            type="number"
            min="0"
            v-model.number="tmp_element.tokens"
          />
          <input
            v-show="tmp_element.weight !== undefined"
            type="number"
            min="1"
            v-model.number="tmp_element.weight"
          />
          <div>
            <button style="padding: 0;" @click="tmp_element = null">
              Cancelar
            </button>
            <button style="padding: 0;" type="submit" @click="update_element">
              Atualizar
            </button>
          </div>
        </form>
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
    OptionSimulate
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
      current_state: "",
      x: 0,
      y: 0,
      tmp_element: null,
      element_names: {
        names: [],
        need_update: true
      }
    };
  },

  methods: {
    set_graph(graph) {
      this.graph = graph;
    },

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

    handle_element_click({ id, type }) {
      if (this.current_state === "setting_arc") {
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
      } else if (this.current_state === "setting_token") {
        const place = this.places.find((place) => place.id === id);

        place.tokens++;
      } else if (this.current_state === "removing_token") {
        const place = this.places.find((place) => place.id === id);

        if (place.tokens > 0) {
          place.tokens--;
        }
      } else if (this.current_state === "removing_place" && type === "place") {
        const index = this.places.findIndex((place) => place.id === id);

        this.arcs = this.arcs.filter(
          (arc) => arc.source !== id && arc.target !== id
        );
        this.places.splice(index, 1);
      } else if (
        this.current_state === "removing_transition" &&
        type === "transition"
      ) {
        const index = this.transitions.findIndex(
          (transition) => transition.id === id
        );

        this.arcs = this.arcs.filter(
          (arc) => arc.source !== id && arc.target !== id
        );
        this.transitions.splice(index, 1);
      }
    },

    handle_link_click({ id }) {
      if (this.current_state === "removing_arc") {
        const index = this.arcs.findIndex((arc) => arc.id === id);

        this.arcs.splice(index, 1);
      }
    },

    handle_element_contextmenu({ id, type, position }) {
      if (type === "place") {
        const index = this.places.findIndex((place) => place.id === id);
        this.tmp_element = { index, type, ...this.places[index] };
      } else if (type === "transition") {
        const index = this.transitions.findIndex(
          (transition) => transition.id === id
        );
        this.tmp_element = { index, type, ...this.transitions[index] };
      } else if (type === "arc") {
        const index = this.arcs.findIndex((arc) => arc.id === id);
        this.tmp_element = { index, type, ...this.arcs[index] };
      }

      this.x = position.x;
      this.y = position.y;
    },

    update_element() {
      if (this.tmp_element.type === "place") {
        const place = this.places[this.tmp_element.index];
        for (const key in place) {
          if (key === "name") {
            if (this.element_names.need_update) {
              this.element_names.names = [];
              this.element_names.names.push(...this.places.map((p) => p.name));
              this.element_names.names.push(
                ...this.transitions.map((t) => t.name)
              );
            }

            if (place.name !== this.tmp_element.name) {
              if (!this.element_names.names.includes(this.tmp_element.name)) {
                place.name = this.tmp_element.name;
                this.element_names.need_update = true;
              } else {
                this.element_names.need_update = false;
              }
            }
          } else {
            place[key] = this.tmp_element[key];
          }
        }
        this.tmp_element = null;
      } else if (this.tmp_element.type === "transition") {
        const transition = this.transitions[this.tmp_element.index];
        for (const key in transition) {
          if (key === "name") {
            if (this.element_names.need_update) {
              this.element_names.names = [];
              this.element_names.names.push(...this.places.map((p) => p.name));
              this.element_names.names.push(
                ...this.transitions.map((t) => t.name)
              );
            }

            if (transition.name !== this.tmp_element.name) {
              if (!this.element_names.names.includes(this.tmp_element.name)) {
                transition.name = this.tmp_element.name;
                this.element_names.need_update = true;
              } else {
                this.element_names.need_update = false;
              }
            }
          } else {
            transition[key] = this.tmp_element[key];
          }
        }
        this.tmp_element = null;
      } else if (this.tmp_element.type === "arc") {
        const arc = this.arcs[this.tmp_element.index];
        for (const key in arc) {
          arc[key] = this.tmp_element[key];
        }
        this.tmp_element = null;
      }
    }
  }
};
</script>
