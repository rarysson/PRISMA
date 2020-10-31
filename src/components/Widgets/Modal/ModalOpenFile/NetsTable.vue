<template>
  <table v-if="nets.length !== 0">
    <thead>
      <tr>
        <th>Nome da rede</th>
        <th>Última modificação</th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="net in nets"
        :key="net.name"
        @click="select_item(net.name, $event)"
      >
        <td>{{ net.name }}</td>
        <td>
          {{ net.last_update }}
        </td>
      </tr>
    </tbody>
  </table>
  <div v-else>
    <h1>Nenhuma rede fo criada</h1>
  </div>
</template>

<script>
export default {
  name: "NetsTable",

  props: {
    loading: {
      type: Boolean,
      default: false
    },

    nets: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      current_name: "",
      old_selected_item: null
    };
  },

  methods: {
    select_item(name, event) {
      if (name !== this.current_name) {
        this.current_name = name;
        this.old_selected_item?.classList.remove("active");
        this.old_selected_item = event.target.parentElement;
        this.old_selected_item.classList.add("active");
        this.$emit("click", this.current_name);
      }
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th {
  font-size: 1.2rem;
  text-align: left;
  padding: 10px 0;
}

tbody tr:nth-child(even) {
  background-color: var(--light);
}

tbody tr:nth-child(odd) {
  background-color: var(--light-gray);
}

td {
  padding: 15px 10px;
}

/* stylelint-disable selector-no-qualifying-type*/
tbody tr:hover,
tbody tr.active {
  cursor: pointer;
  color: var(--light);
  background-color: gray;
}

th:last-child,
td:last-child {
  text-align: right;
}

td:last-child {
  font-size: 0.9rem;
  font-style: italic;
  font-weight: 300;
}
</style>
