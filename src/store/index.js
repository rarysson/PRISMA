import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

function is_object_empty(object) {
    return Object.keys(object).length === 0;
}

export default new Vuex.Store({
    state: {
        net: { cells: [] },
        paper_dimensions: {},
        net_name: null,
        need_update_net: false,
        configs: {
            save: {
                auto_save: false,
                delay: 25
            }
        },
        user_logged: false,
        user: {}
    },

    getters: {
        net: (state) => state.net,
        paper_dimensions: (state) => state.paper_dimensions,
        save_config: (state) => state.configs.save,
        net_name: (state) => state.net_name,
        need_update_net: (state) => state.need_update_net,
        is_net_empty: (state) => state.net.cells.length === 0,
        is_dimensions_empty: (state) => is_object_empty(state.paper_dimensions),
        user_logged: (state) => state.user_logged,
        user: (state) => state.user
    },

    actions: {
        set_net({ commit }, net) {
            commit("set_net", net);
        },

        set_net_name({ commit }, net_name) {
            commit("set_net_name", net_name);
        },

        request_net_update({ commit }, update) {
            commit("set_need_update_net", update);
        },

        set_paper_dimensions({ commit }, paper_dimensions) {
            commit("set_paper_dimensions", paper_dimensions);
        },

        set_save_config({ commit }, config) {
            commit("set_save_config", config);
        },

        empty_net({ commit }) {
            commit("set_net", { cells: [] });
        },

        log_in({ commit }) {
            commit("set_user_logged", true);
        },

        log_out({ commit }) {
            commit("set_user_logged", false);
            commit("set_user", {});
        },

        set_user({ commit }, user) {
            commit("set_user", user);
        }
    },

    mutations: {
        set_net(state, net) {
            state.net = net;
        },

        set_net_name(state, net_name) {
            state.net_name = net_name;
        },

        set_need_update_net(state, update) {
            state.need_update_net = update;
        },

        set_paper_dimensions(state, paper_dimensions) {
            state.paper_dimensions = paper_dimensions;
        },

        set_save_config(state, config) {
            state.configs.save = config;
        },

        set_user_logged(state, payload) {
            state.user_logged = payload;
        },

        set_user(state, user) {
            state.user = user;
        }
    }
});
