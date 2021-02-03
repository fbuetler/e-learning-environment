import { shallowMount, config } from "@vue/test-utils";
import To from "@/components/numbersystems/To.vue";
import From from "@/components/numbersystems/From.vue";
import Swap from "@/components/numbersystems/Swap.vue";

config.showDeprecationWarnings = false;

enum numbersystemsType {
  DECIMAL,
  BINARY,
  MAYA,
}

const mockNumber = 27;
const mockDecimalSolution = [0, 1, 0, 1, 1, 0]; // 20 + 5 + 2= 27
const mockRandomNumber = jest.fn((x) => mockNumber);
const mockItems = [0, 0, 1, 1, 5, 2]; //  + 1*10 + 1*5 + 5*2 + 2*1 = 27
const mockGenerateItems = jest.fn((x) => mockItems);

describe("To.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(To, {
      propsData: {
        args: {
          numbersystemType: numbersystemsType.DECIMAL,
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
    wrapper.vm.start();
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
    for (let i = 0; i < mockDecimalSolution.length; i++) {
      for (let j = 0; j < mockDecimalSolution[i]; j++) {
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
          numbersystemType: numbersystemsType.DECIMAL,
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
    wrapper.vm.start();
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
          numbersystemType: numbersystemsType.DECIMAL,
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
    wrapper.vm.start();
    expect(wrapper.vm["selected"]).toBeNull();
    expect(wrapper.vm["selectedItems"].every((el) => el === 0)).toBeTruthy();
    expect(wrapper.vm["generatedItems"]).toEqual(mockItems);
  });

  it("undo restores initial conditions", async () => {
    wrapper.setData({ selected: 0 });
    await wrapper.find("#dropzone").trigger("click");
    wrapper.vm.start();
    expect(wrapper.vm["selected"]).toBeNull();
    expect(wrapper.vm["selectedItems"].every((el) => el === 0)).toBeTruthy();
    expect(wrapper.vm["generatedItems"]).toEqual(mockItems);
  });

  it("correct result is accepted", async () => {
    for (let i = 0; i < mockDecimalSolution.length; i++) {
      for (let j = 0; j < mockDecimalSolution[i]; j++) {
        wrapper.setData({ selected: i });
        await wrapper.find("#dropzone").trigger("click");
      }
    }
    expect(wrapper.vm.isCorrect()).toBeTruthy();
  });

  it("incorrect result is rejected (correct sum, but not less items)", async () => {
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

describe("Addition.vue", () => {
  // TODO add tests
});
