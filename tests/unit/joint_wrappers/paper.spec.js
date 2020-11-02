import { shallowMount, createLocalVue } from "@vue/test-utils";
import JointPaper from "@/components/Joint/JointPaper";
import Vuex from "vuex";
import { get_store } from "../data/store";

let wrapper;
let store;
let graph;
const localVue = createLocalVue();
const config_data = () => ({
    store,
    localVue,
    attachTo: "#root",
    propsData: {
        graph
    }
});

localVue.use(Vuex);

beforeEach(() => {
    const div = document.createElement("div");
    div.id = "root";
    document.body.appendChild(div);
    graph = new window.joint.dia.Graph();
    store = new Vuex.Store(get_store());
    wrapper = shallowMount(JointPaper, config_data());
});

afterEach(() => {
    wrapper.destroy();
});

describe("Componente JointPaper", () => {
    test("Está instanciado", () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    test("Paper data é não nulo após componente instanciado", () => {
        expect(wrapper.vm.paper).not.toBeNull();
    });

    test("Emite evento mounted", () => {
        expect(wrapper.emitted().mounted.length).toBe(1);
    });

    test("Evento mounted retorna um objeto paper", () => {
        expect(typeof wrapper.emitted().mounted[0][0]).toBe("object");
    });

    test("Paper é destruído", () => {
        wrapper.destroy();

        expect(wrapper.exists()).toBeFalsy();
    });

    test("Emite evento blank-click", () => {
        wrapper.vm.$emit("blank-click", { x: 0, y: 0 });
        const { x, y } = wrapper.emitted()["blank-click"][0][0];

        expect(wrapper.emitted()["blank-click"].length).toBe(1);
        expect(typeof wrapper.emitted()["blank-click"][0]).toBe("object");
        expect(x).toBe(0);
        expect(y).toBe(0);
    });

    test("Emite evento element-click", () => {
        wrapper.vm.$emit("element-click", {
            id: "d61d6f96-b520-4e52-9436-14dcdc6a61ea",
            type: "place"
        });
        const { id, type } = wrapper.emitted()["element-click"][0][0];

        expect(wrapper.emitted()["element-click"].length).toBe(1);
        expect(typeof wrapper.emitted()["element-click"][0]).toBe("object");
        expect(id).toBe("d61d6f96-b520-4e52-9436-14dcdc6a61ea");
        expect(type).toBe("place");
    });

    test("Emite evento element-contextmenu", () => {
        wrapper.vm.$emit("element-contextmenu", {
            id: "d61d6f96-b520-4e52-9436-14dcdc6a61ea",
            type: "transition",
            position: { x: 50, y: 50 }
        });
        const { id, type, position } = wrapper.emitted()[
            "element-contextmenu"
        ][0][0];

        expect(wrapper.emitted()["element-contextmenu"].length).toBe(1);
        expect(typeof wrapper.emitted()["element-contextmenu"][0]).toBe(
            "object"
        );
        expect(id).toBe("d61d6f96-b520-4e52-9436-14dcdc6a61ea");
        expect(type).toBe("transition");
        expect(position.x).toBe(50);
        expect(position.y).toBe(50);
    });
});
