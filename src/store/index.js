import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        net: {},
        net_name: null
    },

    getters: {
        net: (state) => state.net,
        net_name: (state) => state.net_name,
        is_net_empty: (state) => Object.keys(state.net).length === 0
    },

    actions: {
        set_net({ commit }, net) {
            commit("set_net", net);
        },

        set_net_name({ commit }, net_name) {
            commit("set_net_name", net_name);
        }
    },

    mutations: {
        set_net(state, net) {
            state.net = net;
        },

        set_net_name(state, net_name) {
            state.net_name = net_name;
        }
    }
});
