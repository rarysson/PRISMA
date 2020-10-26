<template>
  <div
    class="paper-container"
    :style="{
      width: `${paper_container_width}px`,
      height: `${paper_container_height}px`
    }"
  >
    <vue-drag-resize
      :prevent-active-behavior="freezeDimensions"
      :w="initial_width"
      :minw="400"
      :h="initial_height"
      :minh="200"
      :x="initial_x"
      :y="initial_y"
      :is-draggable="false"
      :stick-size="15"
      content-class="paper-border"
      @resizing="resize_paper"
      :style="{ transform: paper_border_transform }"
    >
      <div id="joint-paper" ref="paper">
        <slot />
      </div>
      <slot name="overlay-elements" />
    </vue-drag-resize>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { get_formatted_joint_type } from "@/util/funcs";
import VueDragResize from "vue-drag-resize";

export default {
  name: "JointPaper",

  props: {
    graph: {
      type: Object,
      required: true
    },

    extraOptions: {
      type: Object,
      default: () => ({})
    },

    captureMouseMovement: {
      type: Boolean,
      default: false
    },

    freezeDimensions: {
      type: Boolean,
      default: false
    },

    saveDimensionsBeforeDestroy: {
      type: Boolean,
      default: false
    }
  },

  components: {
    VueDragResize
  },

  data() {
    return {
      paper: null,
      paper_container_width: 800,
      paper_container_height: 600,
      paper_border_transform: "",
      padding_paper: "",
      paper_top: 0,
      paper_left: 0,
      initial_width: 800,
      initial_height: 600,
      initial_x: 0,
      initial_y: 0
    };
  },

  mounted() {
    this.padding_paper =
      parseInt(
        getComputedStyle(document.querySelector(".paper-container"))
          .getPropertyValue("--padding-paper")
          .replace("px", "")
      ) * 2;

    this.create_paper_object();
    this.load_initial_values();
    this.bind_events();
    this.$emit("mounted", this.paper);
  },

  beforeDestroy() {
    this.unbind_events();

    if (this.saveDimensionsBeforeDestroy) {
      this.save_dimensions();
    }
  },

  computed: {
    ...mapGetters([
      "paper_dimensions",
      "is_dimensions_empty",
      "need_update_net"
    ])
  },

  watch: {
    need_update_net(update) {
      if (update) {
        this.save_dimensions();
      }
    },

    paper_dimensions() {
      this.load_initial_values();
    }
  },

  methods: {
    ...mapActions(["set_paper_dimensions"]),

    save_dimensions() {
      const transforms = this.paper.translate();

      this.set_paper_dimensions({
        ...this.paper.getComputedSize(),
        top: this.paper_top,
        left: this.paper_left,
        center: { x: transforms.tx, y: transforms.ty }
      });
    },

    create_paper_object() {
      this.paper = new window.joint.dia.Paper({
        el: document.getElementById("joint-paper"),
        model: this.graph,
        gridSize: 1,
        width: this.paper_container_width - this.padding_paper,
        height: this.paper_container_height - this.padding_paper,
        defaultAnchor: { name: "center" },
        defaultConnectionPoint: { name: "boundary" },
        linkPinning: false,
        multiLinks: false,
        allowLink(link) {
          const source_type = link.sourceView.model.attributes.type;
          const target_type = link.targetView.model.attributes.type;

          return source_type !== target_type;
        },
        ...this.extraOptions
      });
    },

    load_initial_values() {
      if (!this.is_dimensions_empty) {
        const { width, height, top, left, center } = this.paper_dimensions;

        this.initial_width = width + this.padding_paper;
        this.initial_height = height + this.padding_paper;
        this.initial_x = left;
        this.initial_y = top;
        this.paper_container_width = width + this.padding_paper * 2;
        this.paper_container_height = height + this.padding_paper * 2;

        this.paper.setDimensions(width, height);
        this.paper.translate(center.x, center.y);
        this.calculate_paper_transforms({ left, top });
      }
    },

    bind_events() {
      this.paper.on("blank:pointerclick", this.handle_blank_click);
      this.paper.on("element:pointerclick", this.handle_element_click);
      this.paper.on("element:contextmenu", this.handle_context_menu);
      this.paper.on("link:pointerclick", this.handle_element_click);
      this.paper.on("link:contextmenu", this.handle_context_menu);
      this.$refs.paper.addEventListener("mousemove", this.handle_mouse_move);
    },

    unbind_events() {
      this.paper.off("blank:pointerclick", this.handle_blank_click);
      this.paper.off("element:pointerclick", this.handle_element_click);
      this.paper.off("element:contextmenu", this.handle_context_menu);
      this.paper.off("link:pointerclick", this.handle_element_click);
      this.paper.off("link:contextmenu", this.handle_context_menu);
      this.$refs.paper.removeEventListener("mousemove", this.handle_mouse_move);
    },

    handle_blank_click(event, x, y) {
      this.$emit("blank-click", this.paper.paperToLocalPoint(x, y));
    },

    handle_element_click(element) {
      const id = element.model.id;
      const type = get_formatted_joint_type(element.model.attributes.type);

      this.$emit("element-click", { id, type });
    },

    handle_context_menu(element, event, x, y) {
      const id = element.model.id;
      const type = get_formatted_joint_type(element.model.attributes.type);

      x += this.$refs.paper.offsetLeft;
      y += this.$refs.paper.offsetTop;

      this.$emit("element-contextmenu", { id, type, position: { x, y } });
    },

    handle_mouse_move(event) {
      if (this.captureMouseMovement) {
        this.$emit(
          "mouse-move",
          this.paper.pageToLocalPoint(event.pageX, event.pageY)
        );
      }
    },

    resize_paper({ top, left, width, height }) {
      let new_width, new_height, translate_x, translate_y;

      if (left < 0) {
        new_width = width;
        translate_x = Math.abs(left);
      } else {
        new_width = left + width;
        translate_x = -left;
      }

      if (top < 0) {
        new_height = height;
        translate_y = Math.abs(top);
      } else {
        new_height = top + height;
        translate_y = -top;
      }

      this.paper_top = top;
      this.paper_left = left;
      this.paper_container_width = new_width + this.padding_paper;
      this.paper_container_height = new_height + this.padding_paper;
      this.calculate_paper_transforms({ left, top });
      this.paper.setDimensions(
        width - this.padding_paper,
        height - this.padding_paper
      );
      this.paper.translate(translate_x, translate_y);
    },

    calculate_paper_transforms({ left, top }) {
      const transform = [];

      if (left < 0) {
        transform.push(`translateX(${Math.abs(left)}px)`);
      }

      if (top < 0) {
        transform.push(`translateY(${Math.abs(top)}px)`);
      }

      this.paper_border_transform = transform.join(" ");
    }
  }
};
</script>

<style scoped>
.paper-container {
  --padding-paper: 50px;
  position: relative;
  min-width: 100%;
  padding: var(--padding-paper);
  transition: all 250ms;
}

.paper-border {
  position: relative;
  padding: var(--padding-paper);
  border: 1px solid black;
}
</style>
