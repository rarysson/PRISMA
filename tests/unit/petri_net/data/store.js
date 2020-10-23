function get_store() {
    return {
        state: {
            net: {}
        },

        getters: {
            net: (state) => state.net,
            net_name: () => "test",
            is_net_empty: (state) => Object.keys(state.net).length === 0,
            need_update_net: () => false
        },

        actions: {
            set_net({ commit }, net) {
                commit("set_net", net);
            }
        },

        mutations: {
            set_net(state, net) {
                state.net = net;
            }
        }
    };
}

export { get_store };
