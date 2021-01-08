import { shallowMount } from "@vue/test-utils";
import Trashcan from "@/components/Trashcan.vue";

describe("Trashcan.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Trashcan);
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("event triggered on click", async () => {
    await wrapper.find("#trashcan").trigger("click");
    expect(wrapper.emitted("trashed-element")).toBeTruthy();
  });

  it("event triggered on drop", async () => {
    await wrapper.find("#trashcan").trigger("drop");
    expect(wrapper.emitted("trashed-element")).toBeTruthy();
  });
});
