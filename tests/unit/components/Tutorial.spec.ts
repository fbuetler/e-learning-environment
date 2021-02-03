import { mount } from "@vue/test-utils";
import Tutorial from "@/components/shared/Tutorial.vue";

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
