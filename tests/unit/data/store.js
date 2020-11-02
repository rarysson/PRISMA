function get_store() {
    return {
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
            }
        },

        getters: {
            net: (state) => state.net,
            paper_dimensions: (state) => state.paper_dimensions,
            save_config: (state) => state.configs.save,
            net_name: (state) => state.net_name,
            need_update_net: (state) => state.need_update_net,
            is_net_empty: (state) => state.net.cells.length === 0,
            is_dimensions_empty: (state) =>
                Object.keys(state.paper_dimensions).length === 0
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
            }
        }
    };
}

export { get_store };
