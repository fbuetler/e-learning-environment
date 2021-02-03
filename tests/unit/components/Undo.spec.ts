import { shallowMount } from "@vue/test-utils";
import Undo from "@/components/shared/Undo.vue";

describe("Undo.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Undo);
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("event triggered", async () => {
    await wrapper.find("#undo").trigger("click");
    expect(wrapper.emitted("undo-operation")).toBeTruthy();
  });
});
