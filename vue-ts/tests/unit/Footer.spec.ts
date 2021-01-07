import { shallowMount, RouterLinkStub } from "@vue/test-utils";
import Footer from "@/components/layout/Footer.vue";

describe("Footer.vue", () => {
  const wrapper = shallowMount(Footer);

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });
});
