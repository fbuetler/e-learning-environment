import { shallowMount } from "@vue/test-utils";
import To from "@/components/mayas/To.vue";
import From from "@/components/mayas/From.vue";
import Addition from "@/components/mayas/Addition.vue";

describe("To.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(To);
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  /*
    TODO
      - renders correctly
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

  /*
    TODO
      - renders correctly
      - initial conditions hold
      - next task restores initial conditions
      - undo works
      - change difficulty works
      - correct result is evaluated as correct
      - wrong results is evaluated as wrong
      - 
  */
});

describe("Addition.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Addition);
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  /*
    TODO
      - renders correctly
      - initial conditions hold
      - next task restores initial conditions
      - undo works
      - change difficulty works
      - correct result is evaluated as correct
      - wrong results is evaluated as wrong
      - 
  */
});
