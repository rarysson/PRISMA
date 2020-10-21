module.exports = {
    state: {
        net: {}
    },

    getters: {
        net: (state) => state.net,
        is_net_empty: (state) => Object.keys(state.net).length === 0
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
