import { mount, RouterLinkStub } from "@vue/test-utils";
import Home from "@/views/Home.vue";
import views from "@/views/Views";

expect.extend({
  toBeDistinct(received) {
    if (Array.isArray(received) && new Set(received).size === received.length) {
      return {
        message: () => `expected [${received}] has distinct values`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected [${received}] has not distinct values`,
        pass: false,
      };
    }
  },
});

describe("Home.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(Home, {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    });
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  views.forEach((view) => {
    it(`is view '${view.title}' present`, () => {
      const routerLinks = wrapper
        .findAllComponents(RouterLinkStub)
        .filter((w) => w.props().to === view.path);
      expect(routerLinks.length).toBe(1);
      const routerLink = routerLinks.at(0);
      expect(routerLink.exists()).toBe(true);
      expect(routerLink.html()).toContain(view.title);
      expect(routerLink.find("img").exists()).toBe(true);
    });
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });
});
