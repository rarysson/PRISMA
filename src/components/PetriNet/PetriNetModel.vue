<template>
  <div>
    <joint-paper
      v-if="graph !== null"
      :class="{
        'model-paper': true,
        'creating-arc': tmp_arc.length === 1,
        'grabbing': grabbing_element
      }"
      :graph="graph"
      :capture-mouse-movement="capture_mouse"
      :freeze-dimensions="currentState !== '' || tmp_element !== null"
      :save-dimensions-before-destroy="true"
      @blank-click="handle_blank_click"
      @element-click="handle_element_click"
      @element-contextmenu="handle_element_contextmenu"
      @mouse-move="handle_mouse_move"
      @element-mousedown="grabbing_element = true"
      @element-mouseup="grabbing_element = false"
    >
      <div hidden>
        <joint-place
          v-for="(place, i) in places"
          :key="place.key"
          :graph="graph"
          :attrs="place"
          :joint-obj="places_joint_obj[i]"
          @mounted="place.id = $event"
        />
        <joint-transition
          v-for="(transition, i) in transitions"
          :key="transition.key"
          :graph="graph"
          :attrs="transition"
          :joint-obj="transitions_joint_obj[i]"
          @mounted="transition.id = $event"
        />
        <joint-arc
          v-for="(arc, i) in arcs"
          :key="arc.link_id"
          :graph="graph"
          :attrs="arc"
          :joint-obj="arcs_joint_obj[i]"
          @mounted="arc.id = $event"
        />
      </div>
      <template #overlay-elements>
        <context-menu
          v-model="tmp_element"
          :position="context_menu_position"
          @update="update_element"
        />
      </template>
    </joint-paper>

    <modal-create-net v-model="open_modal" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { get_formatted_joint_type } from "@/util/funcs";
import db from "@/util/db";
import JointPaper from "@/components/Joint/JointPaper";
import JointPlace from "@/components/Joint/JointPlace";
import JointTransition from "@/components/Joint/JointTransition";
import JointArc from "@/components/Joint/JointArc";
import ContextMenu from "@/components/Widgets/Joint/ContextMenu";
import ModalCreateNet from "@/components/Widgets/Modal/ModalCreateNet";

export default {
  name: "PetriNetModel",

  props: {
    currentState: {
      type: String,
      required: true
    }
  },

  components: {
    JointPaper,
    JointPlace,
    JointTransition,
    JointArc,
    ContextMenu,
    ModalCreateNet
  },

  data() {
    return {
      graph: null,
      places: [],
      place_id: 0,
      places_joint_obj: [],
      transitions: [],
      transition_id: 0,
      transitions_joint_obj: [],
      arcs: [],
      arcs_joint_obj: [],
      tmp_arc: [],
      follower_tmp_arc: [],
      tmp_element: null,
      context_menu_position: { x: 0, y: 0 },
      element_names: {
        names: [],
        need_update: true
      },
      open_modal: false,
      capture_mouse: false,
      grabbing_element: false,
      id_timeout: null
    };
  },

  async mounted() {
    this.graph = new window.joint.dia.Graph();
    this.follower_tmp_arc = new window.joint.shapes.standard.Link({
      source: {},
      target: {},
      attrs: {
        root: {
          "fill": "none",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          "stroke": "#3a3a3a",
          "pointer-events": "none"
        }
      }
    });

    if (!this.is_net_empty) {
      this.graph.fromJSON(this.net);
      this.create_petri_net_from_cells(this.net.cells);
    } else {
      if (this.net_name !== null) {
        try {
          const data = await db.nets.get(this.net_name);

          if (data) {
            this.graph.fromJSON(data.net);
            this.create_petri_net_from_cells(data.net.cells);
            this.set_net(data.net);
            this.set_paper_dimensions(data.paper_dimensions);
          }
        } catch (error) {
          this.$toast.error(error);
        }
      } else {
        this.open_modal = true;
      }
    }
  },

  beforeDestroy() {
    if (this.has_net_changed()) {
      this.set_net(this.graph.toJSON());
    }
  },

  computed: {
    ...mapGetters(["is_net_empty", "net", "net_name", "need_update_net"])
  },

  watch: {
    need_update_net(update) {
      if (update && this.has_net_changed()) {
        this.set_net(this.graph.toJSON());
      }
    }
  },

  methods: {
    ...mapActions(["set_net", "set_paper_dimensions"]),

    has_net_changed() {
      return JSON.stringify(this.graph.toJSON()) !== JSON.stringify(this.net);
    },

    create_petri_net_from_cells(cells) {
      cells.forEach((cell) => {
        const type = get_formatted_joint_type(cell.type);
        const joint_obj = this.graph.getCell(cell.id);

        if (type === "place") {
          this.places.push({
            key: `P${this.place_id}`,
            id: cell.id,
            name: cell.attrs[".label"].text,
            position: cell.position,
            tokens: cell.tokens
          });

          this.place_id++;
          this.places_joint_obj.push(joint_obj);
        } else if (type === "transition") {
          this.transitions.push({
            key: `T${this.transition_id}`,
            id: cell.id,
            name: cell.attrs[".label"].text,
            position: cell.position
          });

          this.transition_id++;
          this.transitions_joint_obj.push(joint_obj);
        } else if (type === "arc") {
          this.arcs.push({
            id: cell.id,
            link_id: cell.source.id + cell.target.id,
            source: cell.source.id,
            target: cell.target.id,
            weight: cell.weight
          });

          this.arcs_joint_obj.push(joint_obj);
        }
      });
    },

    handle_blank_click({ x, y }) {
      // Aqui eu reduzo os valores de x e y pela metada da largura e altura de cada elemento
      // Para dessa maneira centralizar o elemento em relação ao mouse do usuário
      // Lugar => largura: 50, Altura: 50
      // Transição => largura: 14, Altura: 50
      y -= 25;

      if (this.currentState === "setting_place") {
        x -= 25;

        this.places.push({
          key: `P${this.place_id}`,
          name: `Place ${this.place_id++}`,
          position: { x, y },
          tokens: 0
        });
      } else if (this.currentState === "setting_transition") {
        x -= 7;

        this.transitions.push({
          key: `T${this.transition_id}`,
          name: `Transition ${this.transition_id++}`,
          position: { x, y }
        });
      }
    },

    handle_element_click({ id, type }) {
      if (this.currentState === "setting_arc") {
        this.set_arc(id, type);
      } else if (this.currentState.includes("token")) {
        this.change_token(id);
      } else if (this.currentState.includes("removing")) {
        const key = `${type}s`;
        const index = this[key].findIndex((el) => el.id === id);
        this.arcs = this.arcs.filter(
          (arc) => arc.source !== id && arc.target !== id
        );

        this[key].splice(index, 1);
      }
    },

    change_token(id) {
      const place = this.places.find((place) => place.id === id);

      if (this.currentState === "setting_token") {
        place.tokens++;
      } else if (this.currentState === "removing_token" && place.tokens > 0) {
        place.tokens--;
      }
    },

    set_arc(id, type) {
      if (type === "place" || type === "transition") {
        // Evita de criar uma conexão com o mesmo objeto
        if (this.tmp_arc.length === 1) {
          const source_id = this.tmp_arc[0].id;

          if (source_id !== id) {
            this.tmp_arc.push({ id, type });
          }
        } else {
          this.tmp_arc.push({ id, type });
        }
      }

      if (this.tmp_arc.length === 2) {
        this.create_arc();
      } else if (this.tmp_arc.length === 1) {
        this.create_follower_tmp_arc(type);
      }
    },

    create_arc() {
      this.capture_mouse = false;
      this.follower_tmp_arc.remove();
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
    },

    create_follower_tmp_arc(type) {
      const source = this.tmp_arc[0].id;
      const position = this.graph.getCell(source).attributes.position;
      const offset_x = type === "place" ? 75 : 21;
      this.capture_mouse = true;

      this.follower_tmp_arc.set("source", { id: source });
      this.follower_tmp_arc.set("target", {
        x: position.x + offset_x,
        y: position.y
      });
      this.graph.addCell(this.follower_tmp_arc);
    },

    handle_element_contextmenu({ id, type, position }) {
      const key = `${type}s`;
      const index = this[key].findIndex((el) => el.id === id);
      this.tmp_element = { index, type, ...this[key][index] };
      this.context_menu_position = position;
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
    },

    reset_list_name() {
      this.element_names.names = [];
      this.element_names.names.push(...this.places.map((p) => p.name));
      this.element_names.names.push(...this.transitions.map((t) => t.name));
    },

    handle_mouse_move({ x, y }) {
      this.follower_tmp_arc.set("target", { x, y });
    }
  }
};
</script>

<style>
.model-paper .joint-type-pn-place,
.model-paper .joint-type-pn-transition {
  cursor: grab;
}

.model-paper.grabbing .joint-type-pn-place,
.model-paper.grabbing .joint-type-pn-transition {
  cursor: grabbing;
}

.model-paper.creating-arc .joint-type-pn-place,
.model-paper.creating-arc .joint-type-pn-transition {
  cursor: default;
}

.model-paper .joint-type-pn-link .connection-wrap,
.model-paper .marker-vertices {
  cursor: pointer;
}

.model-paper.creating-arc .marker-arrowheads,
.model-paper.creating-arc .marker-vertices,
.model-paper.creating-arc .connection-wrap {
  display: none;
}
</style>
