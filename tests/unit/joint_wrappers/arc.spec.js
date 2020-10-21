import { shallowMount } from "@vue/test-utils";
import JointArc from "@/components/Joint/JointArc";

const graph = new window.joint.dia.Graph();
let wrapper;

beforeEach(() => {
    wrapper = shallowMount(JointArc, {
        propsData: {
            graph,
            attrs: {
                source: "d61d6f96-b520-4e52-9436-14dcdc6a61ea",
                target: "f52e7c87-a315-9c75-1234-97faedc1f3de",
                weight: 1
            }
        }
    });
});

afterEach(() => {
    wrapper.destroy();
});

describe("Componente JointArc", () => {
    test("Está instanciado", () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    test("Arc data é não nulo após componente instanciado", () => {
        expect(wrapper.vm.arc).not.toBeNull();
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

    test("Arco é inserido na Rede", () => {
        const id = wrapper.emitted().mounted[0][0];

        expect(graph.getCell(id)).toBeTruthy();
    });

    test("Arco é removido na Rede", () => {
        const id = wrapper.emitted().mounted[0][0];

        wrapper.destroy();

        expect(graph.getCell(id)).toBeFalsy();
    });

    test("Não permite definir o peso do arco menor do que 1", async () => {
        expect(wrapper.vm.arc.get("weight")).toBe(1);
        await wrapper.setProps({ attrs: { weight: 0 } });
        expect(wrapper.vm.arc.get("weight")).toBe(1);
        await wrapper.setProps({ attrs: { weight: -1 } });
        expect(wrapper.vm.arc.get("weight")).toBe(1);
        await wrapper.setProps({ attrs: { weight: -5 } });
        expect(wrapper.vm.arc.get("weight")).toBe(1);
    });

    test("Consegue editar o peso de um arco", async () => {
        expect(wrapper.vm.arc.get("weight")).toBe(1);
        await wrapper.setProps({ attrs: { weight: 2 } });
        expect(wrapper.vm.arc.get("weight")).toBe(2);
        await wrapper.setProps({ attrs: { weight: 5 } });
        expect(wrapper.vm.arc.get("weight")).toBe(5);
        await wrapper.setProps({ attrs: { weight: 1 } });
        expect(wrapper.vm.arc.get("weight")).toBe(1);
    });
});
