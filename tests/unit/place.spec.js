import { shallowMount } from "@vue/test-utils";
import JointPlace from "@/components/Joint/JointPlace";

const graph = new window.joint.dia.Graph();
let wrapper;

beforeEach(() => {
    wrapper = shallowMount(JointPlace, {
        propsData: {
            graph,
            attrs: {
                name: "Test",
                position: { x: 0, y: 0 },
                tokens: 0
            }
        }
    });
});

afterEach(() => {
    wrapper.destroy();
});

describe("Componente JointPlace", () => {
    test("Está instanciado", () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    test("Place data é não nulo após componente instanciado", () => {
        expect(wrapper.vm.place).not.toBeNull();
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

    test("Lugar é inserido na Rede", () => {
        const id = wrapper.emitted().mounted[0][0];

        expect(graph.getCell(id)).toBeTruthy();
    });

    test("Lugar é removido na Rede", () => {
        const id = wrapper.emitted().mounted[0][0];

        wrapper.destroy();

        expect(graph.getCell(id)).toBeFalsy();
    });

    test("Não permite inserir fichas com valores negativos num lugar", async () => {
        expect(wrapper.vm.place.get("tokens")).toBe(0);
        await wrapper.setProps({ attrs: { tokens: -1 } });
        expect(wrapper.vm.place.get("tokens")).toBe(0);
        await wrapper.setProps({ attrs: { tokens: -5 } });
        expect(wrapper.vm.place.get("tokens")).toBe(0);
    });

    test("Consegue adicionar uma ficha num lugar", async () => {
        expect(wrapper.vm.place.get("tokens")).toBe(0);
        await wrapper.setProps({ attrs: { tokens: 1 } });
        expect(wrapper.vm.place.get("tokens")).toBe(1);
    });

    test("Consegue remover uma ficha num lugar", async () => {
        expect(wrapper.vm.place.get("tokens")).toBe(0);
        await wrapper.setProps({ attrs: { tokens: 1 } });
        expect(wrapper.vm.place.get("tokens")).toBe(1);
        await wrapper.setProps({ attrs: { tokens: 0 } });
        expect(wrapper.vm.place.get("tokens")).toBe(0);
    });

    test("Consegue editar fichas de um lugar", async () => {
        expect(wrapper.vm.place.get("tokens")).toBe(0);
        await wrapper.setProps({ attrs: { tokens: 1 } });
        expect(wrapper.vm.place.get("tokens")).toBe(1);
        await wrapper.setProps({ attrs: { tokens: 5 } });
        expect(wrapper.vm.place.get("tokens")).toBe(5);
        await wrapper.setProps({ attrs: { tokens: 0 } });
        expect(wrapper.vm.place.get("tokens")).toBe(0);
    });

    test("Consegue editar o nome de um lugar", async () => {
        expect(wrapper.vm.place.attr(".label/text")).toBe("Test");
        await wrapper.setProps({ attrs: { name: "Lugar modificado" } });
        expect(wrapper.vm.place.attr(".label/text")).toBe("Lugar modificado");
    });
});
