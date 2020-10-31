<template>
  <transition name="modal" appear>
    <div v-if="open" class="overlay">
      <div class="modal">
        <slot />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Modal",

  props: {
    value: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      open: this.value,
      net_name: null
    };
  },

  watch: {
    value() {
      this.open = this.value;
    },

    open() {
      this.$emit("input", this.open);
    }
  }
};
</script>

<style scoped>
.overlay {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: grid;
  place-items: center;
  background-color: rgba(75, 75, 75, 0.75);
  z-index: 99;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s;
}

.modal {
  position: relative;
  border-radius: 10px;
  transition: all 0.3s;
}

.modal-enter .modal,
.modal-leave-to .modal {
  transform: scale(0.1);
}
</style>
