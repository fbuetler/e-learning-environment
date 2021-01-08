import { shallowMount, createLocalVue } from "@vue/test-utils";
import VueRouter from "vue-router";
import App from "@/App.vue";

describe("App.vue", () => {
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();

  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(App, {
      localVue,
      router,
    });
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });
});
