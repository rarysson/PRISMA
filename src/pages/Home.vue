<template>
  <div class="page-container">
    <div class="menu" style="text-align: center; padding-top: 20px;">
      <button style="padding: 15px;" @click="setting_place = !setting_place">
        LUGAR
      </button>
      <button
        style="padding: 15px;"
        @click="setting_transition = !setting_transition"
      >
        TRANSIÇÃO
      </button>
    </div>

    <joint-paper @mounted="set_graph" @click="set_object">
      <div v-if="graph !== null" hidden>
        <joint-place
          v-for="(place, index) in places"
          :key="`P${index}`"
          :graph="graph"
          :attrs="place"
        />
        <joint-transition
          v-for="(transition, index) in transitions"
          :key="`T${index}`"
          :graph="graph"
          :attrs="transition"
        />
      </div>
    </joint-paper>
  </div>
</template>

<script>
import JointPaper from "@/components/JointPaper";
import JointPlace from "@/components/JointPlace";
import JointTransition from "@/components/JointTransition";

export default {
  name: "Home",

  components: {
    JointPaper,
    JointPlace,
    JointTransition
  },

  data() {
    return {
      graph: null,
      places: [],
      place_id: 0,
      setting_place: false,
      transitions: [],
      transition_id: 0,
      setting_transition: false
    };
  },

  methods: {
    set_graph(graph) {
      this.graph = graph;
    },

    set_object({ x, y }) {
      if (this.setting_place) {
        this.places.push({
          name: `Place ${this.place_id++}`,
          position: { x, y }
        });
      } else if (this.setting_transition) {
        this.transitions.push({
          name: `Transition ${this.transition_id++}`,
          position: { x, y }
        });
      }
    }
  }
};
</script>
