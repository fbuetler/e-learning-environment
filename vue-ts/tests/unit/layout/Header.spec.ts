import { shallowMount, RouterLinkStub } from "@vue/test-utils";
import Header from "@/components/layout/Header.vue";

describe("Header.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Header, {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    });
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("has image", () => {
    expect(wrapper.find("img").exists()).toBe(true);
  });

  it("has correct home path", () => {
    expect(wrapper.findComponent(RouterLinkStub).props().to).toBe("/");
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });
});
