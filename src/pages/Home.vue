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
      <button style="padding: 15px;" @click="setting_arc = !setting_arc">
        ARCO
      </button>
      <button style="padding: 15px;">
        FICHA
      </button>
    </div>

    <joint-paper
      @mounted="set_graph"
      @blank-click="set_object"
      @element-click="set_arc"
    >
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
      setting_place: false,
      transitions: [],
      transition_id: 0,
      setting_transition: false,
      arcs: [],
      tmp_arc: [],
      setting_arc: false
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
    },

    set_arc(element_id) {
      if (this.setting_arc) {
        this.tmp_arc.push(element_id);

        if (this.tmp_arc.length === 2) {
          this.arcs.push({ source: this.tmp_arc[0], target: this.tmp_arc[1] });

          this.tmp_arc = [];
        }
      }
    }
  }
};
</script>
