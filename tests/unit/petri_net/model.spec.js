import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import flushPromises from "flush-promises";
import PetriNetModel from "@/components/PetriNet/PetriNetModel";
import { get_store } from "./data/store";
import net from "./data/net.json";

const localVue = createLocalVue();
let wrapper;
let store;
const id = "d61d6f96-b520-4e52-9436-14dcdc6a61ea";
const id_2 = "f52e7c87-a315-9c75-1234-97faedc1f3de";
const config_data = () => ({
    store,
    localVue,
    propsData: {
        currentState: ""
    }
});

localVue.use(Vuex);

beforeEach(async () => {
    store = new Vuex.Store(get_store());
    wrapper = shallowMount(PetriNetModel, config_data());
    await flushPromises();
});

afterEach(() => {
    wrapper.destroy();
});

describe("Componente PetriNetModel", () => {
    test("Está instanciado", () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    test("Graph data é não nulo após componente instanciado", () => {
        expect(wrapper.vm.graph).not.toBeNull();
    });

    test("Cria a Rede a partir de um objeto JSON", () => {
        store.dispatch("set_net", net);
        wrapper = shallowMount(PetriNetModel, config_data());
        expect(wrapper.vm.graph.toJSON().cells.length).toBeGreaterThan(0);
    });

    test("Não permite criar um arco para elementos do mesmo tipo", () => {
        wrapper.vm.set_arc(id, "place");
        wrapper.vm.set_arc(id, "place");
        expect(wrapper.vm.arcs.length).toBe(0);
        wrapper.vm.set_arc(id, "transition");
        wrapper.vm.set_arc(id, "transition");
        expect(wrapper.vm.arcs.length).toBe(0);
    });

    test("Não permite criar arco com outro arco como origem", () => {
        wrapper.vm.set_arc(id, "arc");
        wrapper.vm.set_arc(id_2, "place");
        expect(wrapper.vm.arcs.length).toBe(0);
    });

    test("Não permite criar arco com outro arco como destino", () => {
        wrapper.vm.set_arc(id, "place");
        wrapper.vm.set_arc(id_2, "arc");
        expect(wrapper.vm.arcs.length).toBe(0);
    });
});
