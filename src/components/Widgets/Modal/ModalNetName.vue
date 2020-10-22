<template>
  <modal v-model="open">
    <form @submit.prevent="submit_net_name">
      <input
        type="text"
        v-model.trim="net_name"
        placeholder="nome da rede"
        required
      />
      <button type="submit">confirmar</button>
    </form>
  </modal>
</template>

<script>
import { mapActions } from "vuex";
import db from "@/util/db";
import Modal from "./Modal";

export default {
  name: "ModalNetName",

  props: {
    value: {
      type: Boolean,
      required: true
    }
  },

  components: {
    Modal
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
  },

  methods: {
    ...mapActions(["set_net_name"]),

    async submit_net_name() {
      try {
        const data = await db.nets.get(this.net_name);

        if (!data) {
          this.set_net_name(this.net_name);
          this.open = false;
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style scoped>
/deep/ .modal {
  width: 500px;
  height: 200px;
  background-color: whitesmoke;
  padding: 3%;
}
</style>
