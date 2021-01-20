import { shallowMount } from "@vue/test-utils";
import To from "@/components/coins/To.vue";
import From from "@/components/coins/From.vue";
import Swap from "@/components/coins/Swap.vue";

describe("To.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(To);
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  /*
    TODO
      - initial conditions hold
      - next task restores initial conditions
      - undo works
      - change difficulty works
      - correct result is evaluated as correct
      - wrong results is evaluated as wrong
      - 
  */
});

describe("From.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(From);
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  /*
    TODO
      - initial conditions hold
      - next task restores initial conditions
      - undo works
      - change difficulty works
      - correct result is evaluated as correct
      - wrong results is evaluated as wrong
      - 
  */
});

describe("Swap.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Swap);
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  /*
    TODO
      - initial conditions hold
      - next task restores initial conditions
      - undo works
      - change difficulty works
      - correct result is evaluated as correct
      - wrong results is evaluated as wrong
      - 
  */
});
