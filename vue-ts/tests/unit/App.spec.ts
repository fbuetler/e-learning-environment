import { shallowMount, createLocalVue } from "@vue/test-utils";
import VueRouter from "vue-router";
import App from "@/App.vue";

describe("App.vue", () => {
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();

  it("is a Vue instance", () => {
    const wrapper = shallowMount(App, {
      localVue,
      router,
    });
    expect(wrapper.vm).toBeTruthy();
  });
});
