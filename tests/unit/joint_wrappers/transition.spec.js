import { shallowMount } from "@vue/test-utils";
import JointTransition from "@/components/Joint/JointTransition";

const graph = new window.joint.dia.Graph();
let wrapper;

beforeEach(() => {
    wrapper = shallowMount(JointTransition, {
        propsData: {
            graph,
            attrs: {
                name: "Test",
                position: { x: 0, y: 0 }
            }
        }
    });
});

afterEach(() => {
    wrapper.destroy();
});

describe("Componente JointTransition", () => {
    test("Está instanciado", () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    test("Transition data é não nulo após componente instanciado", () => {
        expect(wrapper.vm.transition).not.toBeNull();
    });

    test("Emite evento mounted", () => {
        expect(wrapper.emitted().mounted.length).toBe(1);
        expect(typeof wrapper.emitted().mounted[0][0]).toBe("string");
    });

    test("Evento mounted retorna um id", () => {
        wrapper.vm.$emit("mounted", "d61d6f96-b520-4e52-9436-14dcdc6a61ea");

        expect(wrapper.emitted().mounted[1][0]).toBe(
            "d61d6f96-b520-4e52-9436-14dcdc6a61ea"
        );
    });

    test("Transição é inserida na Rede", () => {
        const id = wrapper.emitted().mounted[0][0];

        expect(graph.getCell(id)).toBeTruthy();
    });

    test("Transição é removida na Rede", () => {
        const id = wrapper.emitted().mounted[0][0];

        wrapper.destroy();

        expect(graph.getCell(id)).toBeFalsy();
    });

    test("Consegue editar o nome de uma transição", async () => {
        expect(wrapper.vm.transition.attr(".label/text")).toBe("Test");
        await wrapper.setProps({ attrs: { name: "Transição" } });
        expect(wrapper.vm.transition.attr(".label/text")).toBe("Transição");
    });
});
