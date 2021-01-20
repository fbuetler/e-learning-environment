import { shallowMount } from "@vue/test-utils";
import PatternEncryption from "@/components/ciphertexts/PatternEncryption.vue";
import PatternDecryption from "@/components/ciphertexts/PatternDecryption.vue";
import SymbolEncryption from "@/components/ciphertexts/SymbolEncryption.vue";
import SymbolDecryption from "@/components/ciphertexts/SymbolDecryption.vue";

describe("PatternEncryption.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(PatternEncryption);
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

describe("PatternDecryption.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(PatternDecryption);
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

describe("SymbolEncryption.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(SymbolEncryption);
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

describe("SymbolDecryption.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(SymbolDecryption);
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
