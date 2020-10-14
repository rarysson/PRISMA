<template>
  <div class="page-container">
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

    <joint-paper
      @mounted="set_graph"
      @blank-click="set_object"
      @element-click="handle_element_click"
    >
      <div v-if="graph !== null" hidden>
        <joint-place
          v-for="(place, index) in places"
          :key="`P${index}`"
          :graph="graph"
          :attrs="place"
          @mounted="place.id = $event"
        />
        <joint-transition
          v-for="(transition, index) in transitions"
          :key="`T${index}`"
          :graph="graph"
          :attrs="transition"
        />
        <joint-arc
          v-for="(arc, index) in arcs"
          :key="`A${index}`"
          :graph="graph"
          :source="arc.source"
          :target="arc.target"
        />
      </div>
    </joint-paper>
  </div>
</template>

<script>
import JointPaper from "@/components/JointPaper";
import JointPlace from "@/components/JointPlace";
import JointTransition from "@/components/JointTransition";
import JointArc from "@/components/JointArc";

export default {
  name: "Home",

  components: {
    JointPaper,
    JointPlace,
    JointTransition,
    JointArc
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

  methods: {
    set_graph(graph) {
      this.graph = graph;
    },

    toggle_state(state) {
      for (const key in this.states) {
        if (key === state) {
          this.states[key] = !this.states[key];
        } else {
          this.states[key] = false;
        }
      }
    },

    set_object({ x, y }) {
      if (this.states.setting_place) {
        this.places.push({
          name: `Place ${this.place_id++}`,
          position: { x, y },
          tokens: 0
        });
      } else if (this.states.setting_transition) {
        this.transitions.push({
          name: `Transition ${this.transition_id++}`,
          position: { x, y }
        });
      }
    },

    handle_element_click({ id, type }) {
      if (this.states.setting_arc) {
        this.tmp_arc.push({ id, type });

        if (this.tmp_arc.length === 2) {
          const source = this.tmp_arc[0];
          const target = this.tmp_arc[1];

          if (source.type !== target.type) {
            const has_arc = this.arcs.some(
              (arc) => arc.source === source.id && arc.target === target.id
            );

            if (!has_arc) {
              this.arcs.push({ source: source.id, target: target.id });
            }
          }

          this.tmp_arc = [];
        }
      } else if (this.states.setting_token) {
        const place = this.places.find((place) => place.id === id);
        place.tokens++;
      } else if (this.states.removing_token) {
        const place = this.places.find((place) => place.id === id);

        if (place.tokens > 0) {
          place.tokens--;
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
