<template>
  <modal v-model="open">
    <form @submit.prevent="submit_net_name">
      <ul>
        <li v-for="(net, i) in nets" :key="i" @click="net_name = net.name">
          {{ net.name }}
        </li>
      </ul>
      <button type="button" @click="open = false">cancelar</button>
      <button type="submit">confirmar</button>
    </form>
  </modal>
</template>

<script>
import { mapActions } from "vuex";
import db from "@/util/db";
import Modal from "./Modal";

export default {
  name: "ModalOpenFile",

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
      net_name: null,
      nets: []
    };
  },

  async mounted() {
    try {
      const data = await db.nets.toArray();
      const d = data.map((i) => ({
        name: i.name,
        last_update: i.last_update
      }));
      this.nets = d;
    } catch (error) {
      console.log(error);
    }
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
    ...mapActions(["set_net_name", "empty_net"]),

    submit_net_name() {
      this.empty_net();
      this.set_net_name(this.net_name);
      this.open = false;
    }
  }
};
</script>

<style scoped>
/deep/ .modal {
  width: 750px;
  height: 550px;
  background-color: whitesmoke;
  padding: 3%;
}
</style>
