<template>
  <modal v-model="open">
    <div class="modal-content">
      <div class="nets-table-container">
        <nets-table :nets="data" @click="net_name = $event" />
      </div>

      <div class="btns-container">
        <button @click="open = false" class="danger">Cancelar</button>
        <button @click="submit_net_name" class="success">Confirmar</button>
      </div>
    </div>
  </modal>
</template>

<script>
import { mapActions } from "vuex";
import db from "@/util/db";
import Modal from "./Modal";
import NetsTable from "@/components/Widgets/ModalOpenFile/NetsTable";

function get_formatted_date(date_arg) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  };
  const date = new Date(date_arg);

  return date.toLocaleDateString("pt-br", { ...options, month: "numeric" });
}

export default {
  name: "ModalOpenFile",

  props: {
    value: {
      type: Boolean,
      required: true
    }
  },

  components: {
    Modal,
    NetsTable
  },

  data() {
    return {
      open: this.value,
      net_name: null,
      data: []
    };
  },

  async mounted() {
    try {
      const nets = await db.nets.toArray();
      const data = nets.map((net) => ({
        name: net.name,
        last_update: get_formatted_date(net.last_update)
      }));

      this.data = data;
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
  padding: 2% 3%;
}

.modal-content {
  position: relative;
  height: 100%;
}

.nets-table-container {
  height: 90%;
  overflow: auto;
}

.btns-container {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
}

button {
  padding: 10px 20px;
  border: 1px solid transparent;
  border-radius: 5px;
  color: var(--light);
}

.success {
  background-color: var(--success);
  border-color: var(--success);
}

.success:hover {
  color: var(--success);
  background-color: var(--light);
}

.danger {
  background-color: var(--danger);
  border-color: var(--danger);
}

.danger:hover {
  color: var(--danger);
  background-color: var(--light);
}
</style>
