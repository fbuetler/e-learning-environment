import { shallowMount } from "@vue/test-utils";
import PatternEncryption from "@/components/ciphertexts/PatternEncryption.vue";
import PatternDecryption from "@/components/ciphertexts/PatternDecryption.vue";
import SymbolEncryption from "@/components/ciphertexts/SymbolEncryption.vue";
import SymbolDecryption from "@/components/ciphertexts/SymbolDecryption.vue";

jest.mock("@/components/ciphertexts/Ciphertext", () => ({
  LoadRandomElement(key: string): string {
    return "TEST";
  },
  CreatePattern(text: string[], swapAmount: number): Array<[number, number]> {
    if (swapAmount === 1) {
      return [[1, 2]];
    } else if (swapAmount === 2) {
      return [
        [0, 1],
        [2, 3],
      ];
    } else {
      return [];
    }
  },
  Swap(str: string[], pattern: [number, number][]): string[] {
    pattern.forEach(([left, right]) => {
      const tmp = str[left];
      str[left] = str[right];
      str[right] = tmp;
    });
    return str;
  },
}));

describe("PatternEncryption.vue", () => {
  let wrapper;
  const mockDraw = jest.fn();
  beforeEach(() => {
    console.log("mount");
    wrapper = shallowMount(PatternEncryption, {
      methods: { draw: mockDraw },
    });
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  // it("renders correctly", () => {
  //   expect(wrapper.element).toMatchSnapshot();
  // });

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
  const mockDraw = jest.fn();
  beforeEach(() => {
    wrapper = shallowMount(PatternDecryption, {
      methods: { draw: mockDraw },
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
      - 
  */
});

describe("SymbolEncryption.vue", () => {
  let wrapper;
  const mockDraw = jest.fn();
  beforeEach(() => {
    wrapper = shallowMount(SymbolEncryption, {
      methods: { draw: mockDraw },
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
      - 
  */
});

describe("SymbolDecryption.vue", () => {
  let wrapper;
  const mockDraw = jest.fn();
  beforeEach(() => {
    wrapper = shallowMount(SymbolDecryption, {
      methods: { draw: mockDraw },
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
      - 
  */
});
