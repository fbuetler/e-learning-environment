import { shallowMount } from "@vue/test-utils";
import Buttonmenu from "@/components/shared/Buttonmenu.vue";

describe("Buttonmenu.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Buttonmenu);
  });

  it("is a Vue instance)", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("has buttons", () => {
    expect(wrapper.find("button").exists()).toBe(true);
  });

  it("button click start", async () => {
    // TODO test eventBus events
    expect(true).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });
});
