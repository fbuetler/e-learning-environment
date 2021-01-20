import { mount } from "@vue/test-utils";
import Game from "@/components/Game.vue";

describe("Game.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(Game);
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  /*
    TODO
    - tutorial has content
    - showing results works for wrong and correct answers
    - game component is present
  */
});
