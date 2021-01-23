import { shallowMount, config } from "@vue/test-utils";
import PatternEncryption from "@/components/ciphertexts/PatternEncryption.vue";
import PatternDecryption from "@/components/ciphertexts/PatternDecryption.vue";
import SymbolEncryption from "@/components/ciphertexts/SymbolEncryption.vue";
import SymbolDecryption from "@/components/ciphertexts/SymbolDecryption.vue";

config.showDeprecationWarnings = false;

const mockText = "Test";
const mockPatternOne = [[1, 2]] as [number, number][];
const mockPatternTwo = [
  [0, 1],
  [2, 3],
] as [number, number][];
const mockEncryptedTextOne = "TSET";
const mockEncryptedTextTwo = "ETTS";

const mockDraw = jest.fn();
const mockGetAnimationSteps = jest.fn();
jest.mock("@/components/ciphertexts/Ciphertext", () => ({
  LoadRandomElement(key: string): string {
    return mockText;
  },
  CreatePattern(text: string[], swapAmount: number): Array<[number, number]> {
    if (swapAmount === 1) {
      return mockPatternOne;
    } else if (swapAmount === 2) {
      return mockPatternTwo;
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
  beforeEach(() => {
    wrapper = shallowMount(PatternEncryption, {
      methods: { draw: mockDraw, getAnimationSteps: mockGetAnimationSteps },
    });
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("initial conditions hold", () => {
    expect(wrapper.vm["decryptedText"]).toBe(mockText.toUpperCase());
    expect(wrapper.vm["encryptedText"]).toBeNull();
  });

  it("next task restores initial conditions", async () => {
    await wrapper.setData({ encryptedText: "ABC" });
    wrapper.vm.restartGame();
    expect(wrapper.vm["encryptedText"]).toBeNull();
  });

  it("correct answer is accepted", async () => {
    await wrapper.setData({ encryptedText: mockEncryptedTextOne });
    expect(wrapper.vm.isCorrect()).toBeTruthy();
  });

  it("incorrect answer is rejected", async () => {
    await wrapper.setData({ encryptedText: "ABC" });
    expect(wrapper.vm.isCorrect()).toBeFalsy();
  });
});

describe("PatternDecryption.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(PatternDecryption, {
      methods: { draw: mockDraw, getAnimationSteps: mockGetAnimationSteps },
    });
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("initial conditions hold", () => {
    expect(wrapper.vm["decryptedText"]).toBeNull();
    expect(wrapper.vm["encryptedText"]).toBe(mockEncryptedTextOne);
  });

  it("next task restores initial conditions", async () => {
    await wrapper.setData({ decryptedText: "ABC " });
    wrapper.vm.restartGame();
    expect(wrapper.vm["decryptedText"]).toBeNull();
    expect(wrapper.vm["encryptedText"]).toBe(mockEncryptedTextOne);
  });

  it("correct answer is accepted", async () => {
    await wrapper.setData({ decryptedText: mockText });
    expect(wrapper.vm.isCorrect()).toBeTruthy();
  });

  it("incorrect answer is rejected", async () => {
    await wrapper.setData({ decryptedText: "ABC " });
    expect(wrapper.vm.isCorrect()).toBeFalsy();
  });
});

describe("SymbolEncryption.vue", () => {
  // importing enum and classes is broken in ts-jest
});

describe("SymbolDecryption.vue", () => {
  // importing enum and classes is broken in ts-jest
});
