import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import PetriNetSimulate from "@/components/PetriNet/PetriNetSimulate";
import { get_store } from "../data/store";
import net from "../data/net.json";

const localVue = createLocalVue();
let wrapper;
let store;
const config_data = () => ({
    store,
    localVue
});

localVue.use(Vuex);

beforeEach(() => {
    store = new Vuex.Store(get_store());
    store.dispatch("set_net", net);
    wrapper = shallowMount(PetriNetSimulate, config_data());
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
        expect(wrapper.vm.graph.toJSON().cells.length).toBeGreaterThan(0);
    });
});
