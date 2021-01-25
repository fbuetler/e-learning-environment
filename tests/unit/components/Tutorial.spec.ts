import { mount } from "@vue/test-utils";
import Tutorial from "@/components/Tutorial.vue";

describe("Tutorial.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(Tutorial);
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });
});
