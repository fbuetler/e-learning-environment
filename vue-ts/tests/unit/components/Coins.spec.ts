import { shallowMount } from "@vue/test-utils";
import To from "@/components/coins/To.vue";
import From from "@/components/coins/From.vue";
import Swap from "@/components/coins/Swap.vue";

enum coinType {
  NORMAL,
  BINARY,
}

describe("To.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(To, {
      propsData: {
        args: {
          coinType: coinType.NORMAL,
        },
      },
    });
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
    wrapper = shallowMount(From, {
      propsData: {
        args: {
          coinType: coinType.NORMAL,
        },
      },
    });
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

describe("Swap.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Swap, {
      propsData: {
        args: {
          coinType: coinType.NORMAL,
        },
      },
    });
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
