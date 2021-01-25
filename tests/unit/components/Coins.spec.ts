import { shallowMount, config } from "@vue/test-utils";
import To from "@/components/coins/To.vue";
import From from "@/components/coins/From.vue";
import Swap from "@/components/coins/Swap.vue";

config.showDeprecationWarnings = false;

enum coinType {
  NORMAL,
  BINARY,
}

const mockNumber = 27;
const mockNormalCoinsSolution = [0, 1, 1, 0, 1, 0]; // 2 + 5 + 20 = 27
const mockRandomNumber = jest.fn((x) => mockNumber);
const mockItems = [2, 5, 1, 1, 0, 0]; // 2*1 + 5*2 + 1*5 + 1*10 = 27
const mockGenerateItems = jest.fn((x) => mockItems);

describe("To.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(To, {
      propsData: {
        args: {
          coinType: coinType.NORMAL,
        },
      },
      methods: {
        randomNumber: mockRandomNumber,
      },
    });
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("initial conditions hold", () => {
    expect(wrapper.vm["number"]).toBe(mockNumber);
    expect(wrapper.vm["selected"]).toBeNull();
    expect(wrapper.vm["selectedItems"].every((el) => el === 0)).toBeTruthy();
  });

  it("next task restores initial conditions", async () => {
    wrapper.setData({ selected: 0 });
    await wrapper.find("#dropzone").trigger("click");
    wrapper.vm.restartGame();
    expect(wrapper.vm["number"]).toBe(mockNumber);
    expect(wrapper.vm["selected"]).toBeNull();
    expect(wrapper.vm["selectedItems"].every((el) => el === 0)).toBeTruthy();
  });

  it("undo restores initial conditions", async () => {
    wrapper.setData({ selected: 0 });
    await wrapper.find("#dropzone").trigger("click");
    wrapper.vm.undo();
    expect(wrapper.vm["number"]).toBe(mockNumber);
    expect(wrapper.vm["selected"]).toBeNull();
    expect(wrapper.vm["selectedItems"].every((el) => el === 0)).toBeTruthy();
  });

  it("correct result is accepted", async () => {
    for (let i = 0; i < mockNormalCoinsSolution.length; i++) {
      for (let j = 0; j < mockNormalCoinsSolution[i]; j++) {
        wrapper.setData({ selected: i });
        await wrapper.find("#dropzone").trigger("click");
      }
    }
    expect(wrapper.vm.isCorrect()).toBeTruthy();
  });

  it("incorrect result is rejected", async () => {
    wrapper.setData({ selected: 0 });
    await wrapper.find("#dropzone").trigger("click");
    expect(wrapper.vm.isCorrect()).toBeFalsy;
  });
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
      methods: {
        generateItems: mockGenerateItems,
      },
    });
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("initial conditions hold", () => {
    expect(wrapper.vm["number"]).toBeNull();
    expect(wrapper.vm["generatedItems"]).toEqual(mockItems);
    expect(wrapper.vm["solution"]).toBe(mockNumber);
  });

  it("next task restores initial conditions", () => {
    wrapper.setData({ number: 3 });
    wrapper.vm.restartGame();
    expect(wrapper.vm["number"]).toBeNull();
    expect(wrapper.vm["generatedItems"]).toEqual(mockItems);
    expect(wrapper.vm["solution"]).toBe(mockNumber);
  });

  it("correct result is accepted", () => {
    wrapper.setData({ number: mockNumber });
    expect(wrapper.vm.isCorrect()).toBeTruthy;
  });

  it("incorrect result is rejected", () => {
    wrapper.setData({ number: 3 });
    expect(wrapper.vm.isCorrect()).toBeTruthy;
  });
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
      methods: {
        generateItems: mockGenerateItems,
      },
    });
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("initial conditions hold", () => {
    expect(wrapper.vm["selected"]).toBeNull();
    expect(wrapper.vm["selectedItems"].every((el) => el === 0)).toBeTruthy();
    expect(wrapper.vm["generatedItems"]).toEqual(mockItems);
  });

  it("next task restores initial conditions", async () => {
    wrapper.setData({ selected: 0 });
    await wrapper.find("#dropzone").trigger("click");
    wrapper.vm.restartGame();
    expect(wrapper.vm["selected"]).toBeNull();
    expect(wrapper.vm["selectedItems"].every((el) => el === 0)).toBeTruthy();
    expect(wrapper.vm["generatedItems"]).toEqual(mockItems);
  });

  it("undo restores initial conditions", async () => {
    wrapper.setData({ selected: 0 });
    await wrapper.find("#dropzone").trigger("click");
    wrapper.vm.restartGame();
    expect(wrapper.vm["selected"]).toBeNull();
    expect(wrapper.vm["selectedItems"].every((el) => el === 0)).toBeTruthy();
    expect(wrapper.vm["generatedItems"]).toEqual(mockItems);
  });

  it("correct result is accepted", async () => {
    for (let i = 0; i < mockNormalCoinsSolution.length; i++) {
      for (let j = 0; j < mockNormalCoinsSolution[i]; j++) {
        wrapper.setData({ selected: i });
        await wrapper.find("#dropzone").trigger("click");
      }
    }
    expect(wrapper.vm.isCorrect()).toBeTruthy();
  });

  it("incorrect result is rejected (correct sum, but not less coins)", async () => {
    for (let i = 0; i < mockItems.length; i++) {
      for (let j = 0; j < mockItems[i]; j++) {
        wrapper.setData({ selected: i });
        await wrapper.find("#dropzone").trigger("click");
      }
    }
    expect(wrapper.vm.isCorrect()).toBeFalsy();
  });

  it("incorrect result is rejected (wrong sum)", async () => {
    wrapper.setData({ selected: 0 });
    await wrapper.find("#dropzone").trigger("click");
    expect(wrapper.vm.isCorrect()).toBeFalsy();
  });
});