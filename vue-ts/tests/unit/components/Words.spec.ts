import { shallowMount } from "@vue/test-utils";
import Add from "@/components/words/Add.vue";
import Change from "@/components/words/Change.vue";
import Remove from "@/components/words/Remove.vue";
import Swap from "@/components/words/Swap.vue";
import { wordElement } from "@/components/words/Words";

function prepareWord(word: string): wordElement[] {
  return word.split("").map((el, i) => {
    return { id: i, char: el, initialChar: el, locked: true };
  });
}

function addToWord(
  word: wordElement[],
  char: string,
  pos: number
): wordElement[] {
  word.splice(pos, 0, {
    id: Math.max(...word.map((el) => el.id)) + 1,
    char: char,
    initialChar: "",
    locked: false,
  });
  return word;
}

function copy(el) {
  return JSON.parse(JSON.stringify(el));
}

const rawWord = "ADLER";
const mockWord = prepareWord(rawWord);
const mockSimilarWords = ["RADLER", "TADLER", "ADLERN", "ADLERS"];
jest.mock("@/components/words/Words", () => ({
  LoadWords() {
    return [
      JSON.parse(JSON.stringify(mockWord)),
      JSON.stringify(mockSimilarWords).slice(),
    ];
  },
  findCorrectAndWrongSolutions(
    word: string,
    similarWord: string
  ): [number, string, number, string] {
    return [0, "", 0, ""];
  },
  get alphabet() {
    return ["A", "B", "C"];
  },
  get items() {
    return this.alphabet.map((el, i) => {
      return {
        id: i,
        type: i,
        value: i,
        img: el,
        class: "word-char",
      };
    });
  },
}));

describe("Add.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Add, {});
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("mock used correctly", () => {
    expect(wrapper.vm["word"].map((el) => el.char).join("")).toBe(rawWord);
  });

  it("initially all chars are locked and nothing is added", () => {
    expect(wrapper.vm["word"].every((el) => el.locked)).toBeTruthy();
    expect(wrapper.vm["charAdded"]).toBeFalsy();
  });

  for (let i = 0; i <= mockWord.length; i++) {
    it(`adding a char by click at position ${i}`, async () => {
      await wrapper.setData({ selected: 1 }); // 'B'
      wrapper
        .findAll("rect")
        .at(i)
        .trigger("click");
      const newWord = addToWord(copy(mockWord), "B", i);
      expect(wrapper.vm["word"]).toEqual(newWord);
    });
  }

  it("no char selected", () => {
    wrapper.vm.addChar(0);
    expect(copy(wrapper.vm["word"])).toEqual(copy(mockWord));
  });

  it("add a char twice", async () => {
    await wrapper.setData({ selected: 1 }); // 'B'
    wrapper.vm.addChar(0);
    const word = copy(wrapper.vm["word"]);
    await wrapper.setData({ selected: 1 }); // 'B'
    wrapper.vm.addChar(0);
    expect(copy(wrapper.vm["word"])).toEqual(word);
  });

  it("correct word is evaluated as correct", async () => {
    await wrapper.setData({ word: prepareWord(mockSimilarWords[0]) });
    expect(wrapper.vm.isCorrect()).toBeTruthy();
  });

  it("incorrect word is evaluated as incorrect", async () => {
    await wrapper.setData({ word: prepareWord("TESTTEST") });
    expect(wrapper.vm.isCorrect()).toBeFalsy();
  });

  for (let i = 0; i <= mockWord.length; i++) {
    it(`undo is handled correctly at position ${i}`, async () => {
      await wrapper.setData({ word: addToWord(copy(mockWord), "B", i) });
      wrapper.vm.undo();
      expect(copy(wrapper.vm["word"])).toEqual(mockWord);
      expect(wrapper.vm["charAdded"]).toBeFalsy();
    });
  }
});

describe("Change.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Change, {});
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  // TODO: add more tests
});

describe("Remove.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Remove, {});
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  // TODO: add more tests
});

describe("Swap.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Swap, {});
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correctly", () => {
    // TODO: problems with mocking multiple functions in Words
  });

  // TODO: add more tests
});
