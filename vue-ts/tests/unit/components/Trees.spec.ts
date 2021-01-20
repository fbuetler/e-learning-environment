import { shallowMount } from "@vue/test-utils";
import Row from "@/components/trees/Row.vue";
import Sudoku from "@/components/trees/Sudoku.vue";

describe("Row.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Row, {
      propsData: {
        args: {
          size: 3,
        },
      },
    });
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
  */
});

describe("Sudoku.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Sudoku, {
      propsData: {
        args: {
          size: 3,
        },
      },
    });
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
  */
});
