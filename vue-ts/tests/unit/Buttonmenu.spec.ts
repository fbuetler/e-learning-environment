import { shallowMount } from "@vue/test-utils";
import Buttonmenu from "@/components/Buttonmenu.vue";

describe("Buttonmenu.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Buttonmenu, {
      propsData: {
        restartGameText: "Restart",
        evaluateGameText: "Evaluate",
      },
    });
  });

  it("is a Vue instance)", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("has buttons", () => {
    expect(wrapper.find("button").exists()).toBe(true);
  });

  it("correct button texts", () => {
    expect(wrapper.find("button#button-menu-next").text()).toBe("Restart");
    expect(wrapper.find("button#button-menu-check").text()).toBe("Evaluate");
  });

  it("button click restart", async () => {
    // TODO test eventBus events
    expect(true).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });
});
