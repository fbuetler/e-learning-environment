import { shallowMount, RouterLinkStub } from "@vue/test-utils";
import Footer from "@/components/layout/Footer.vue";

describe("Footer.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Footer);
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });
});
