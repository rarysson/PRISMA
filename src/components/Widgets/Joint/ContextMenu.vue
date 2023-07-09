<template>
  <form
    v-if="value !== null"
    class="context-menu-container"
    :style="{
      top: `${position.y}px`,
      left: `${position.x}px`
    }"
    @submit.prevent="submit"
  >
    <div class="input-container" v-if="value.name !== undefined">
      <input type="text" id="net-name" required v-model="value.name" />
      <label for="net-name">{{ $t("ContextMenu.name") }}</label>
    </div>
    <div class="input-container" v-if="value.tokens !== undefined">
      <input
        type="number"
        id="tokens"
        min="0"
        required
        v-model.number="value.tokens"
      />
      <label for="tokens">{{ $t("ContextMenu.tokens") }}</label>
    </div>
    <div class="input-container" v-if="value.weight !== undefined">
      <input
        type="number"
        id="weight"
        min="1"
        required
        v-model.number="value.weight"
      />
      <label for="weight">{{ $t("ContextMenu.weight") }}</label>
    </div>

    <div class="btns-container">
      <btn-close class="btn" @click="close">{{
        $t("ContextMenu.cancel")
      }}</btn-close>
      <btn-confirm class="btn">{{ $t("ContextMenu.update") }}</btn-confirm>
    </div>
  </form>
</template>

<script>
import BtnClose from "@/components/Widgets/Btns/BtnClose";
import BtnConfirm from "@/components/Widgets/Btns/BtnConfirm";

export default {
  name: "ContextMenu",

  props: {
    value: {
      required: true,
      validator(data) {
        return typeof data === "object" || data === null;
      }
    },

    position: {
      type: Object,
      required: true
    }
  },

  components: {
    BtnClose,
    BtnConfirm
  },

  methods: {
    submit() {
      this.$emit("update", this.element);
    },

    close() {
      this.$emit("input", null);
    }
  }
};
</script>

<style scoped>
.context-menu-container {
  position: absolute;
  width: 200px;
  height: 150px;
  padding: 30px 15px 15px;
  border: 2px solid black;
  background-color: var(--light-gray);
}

.input-container {
  position: relative;
}

.input-container:not(:first-child) {
  margin-top: 25px;
}

input {
  border: none;
  padding-left: 5px;
}

label {
  position: absolute;
  top: 50%;
  left: 5px;
  font-size: 0.75rem;
  color: gray;
  transform: translateY(-50%);
  transition: all 250ms;
}

input:focus + label,
input:valid + label,
input:invalid + label {
  font-size: 0.9rem;
  color: var(--dark);
  transform: translateY(-150%) translateX(-5px);
}

.btns-container {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
}

.btn {
  font-size: 0.75rem;
  padding: 5px;
}
</style>
