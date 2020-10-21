import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import PetriNetSimulate from "@/components/PetriNet/PetriNetSimulate";
import store_mock from "./data/store";
import net from "./data/net.json";

const localVue = createLocalVue();
let wrapper;
let store;
const factory = () =>
    shallowMount(PetriNetSimulate, {
        store,
        localVue
    });

localVue.use(Vuex);

beforeEach(() => {
    store = new Vuex.Store(global.lodash.cloneDeep(store_mock));
    wrapper = factory();
});

afterEach(() => {
    wrapper.destroy();
});

describe("Componente PetriNetSimulate", () => {
    test("Está instanciado", () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    test("Graph data é não nulo após componente instanciado", () => {
        expect(wrapper.vm.graph).not.toBeNull();
    });

    test("Cria a Rede a partir de um objeto JSON", () => {
        store.dispatch("set_net", net);
        wrapper = factory();
        expect(wrapper.vm.graph.toJSON().cells.length).toBeGreaterThan(0);
    });
});
