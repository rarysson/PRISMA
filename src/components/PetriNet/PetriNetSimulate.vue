<template>
  <joint-paper
    v-if="graph !== null"
    :graph="graph"
    @element-click="handle_element_click"
  />
</template>

<script>
import { mapGetters } from "vuex";
import JointPaper from "@/components/Joint/JointPaper";

export default {
  name: "PetriNetSimulate",

  components: {
    JointPaper
  },

  data() {
    return {
      graph: null
    };
  },

  mounted() {
    this.graph = new window.joint.dia.Graph();

    if (!this.is_net_empty) {
      this.graph.fromJSON(this.net);
    }
  },

  computed: {
    ...mapGetters(["is_net_empty", "net"])
  },

  methods: {
    handle_element_click({ id, type }) {
      console.log(id, type);
    }
  }
};
</script>
