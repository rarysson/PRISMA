import { shallowMount } from "@vue/test-utils";
import JointPlace from "@/components/Joint/JointPlace";

const graph = new window.joint.dia.Graph();

describe("Componente JointPlace", () => {
    const wrapper = shallowMount(JointPlace, {
        propsData: {
            graph,
            attrs: {
                name: "Test",
                position: { x: 0, y: 0 },
                tokens: 0
            }
        }
    });

    test("Está instanciado", () => {
        expect(wrapper.exists()).toBeTruthy();
    });
});
