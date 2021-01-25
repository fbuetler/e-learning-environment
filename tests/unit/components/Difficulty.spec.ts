import { shallowMount } from "@vue/test-utils";
import Difficulty from "@/components/Difficulty.vue";

describe("Difficulty.vue", () => {
  let wrapper;
  const levels = 2;
  beforeEach(() => {
    wrapper = shallowMount(Difficulty, {
      propsData: {
        difficultyLevels: levels,
        selected: 1,
      },
    });
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  for (let i = 1; i <= levels; i++) {
    it(`event triggered for valid level ${i}`, async () => {
      await wrapper.find(`#difficulty-${i}`).trigger("click");
      expect(wrapper.emitted("difficulty-selected")).toBeTruthy();
      expect(wrapper.emitted("difficulty-selected").length).toBe(1);
      expect(wrapper.emitted("difficulty-selected")[0]).toEqual([i]);
    });
  }

  it("event triggered for invalid level", async () => {
    await wrapper.vm.selectDifficulty(10);
    expect(wrapper.emitted("difficulty-selected")).toBeFalsy();
  });
});
