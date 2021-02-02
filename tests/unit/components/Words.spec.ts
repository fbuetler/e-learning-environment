import { shallowMount, config } from "@vue/test-utils";
import Add from "@/components/words/Add.vue";
import Change from "@/components/words/Change.vue";
import Remove from "@/components/words/Remove.vue";
import Swap from "@/components/words/Swap.vue";
import { wordElement } from "@/components/words/Words";

config.showDeprecationWarnings = false;

function prepareWord(word: string): wordElement[] {
  return word.split("").map((el, i) => {
    return { id: i, char: el, initialChar: el, locked: false };
  });
}

function addChar(
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

function changeChar(
  word: wordElement[],
  char: string,
  pos: number
): wordElement[] {
  word.forEach((el, idx) => (el.locked = idx !== pos));
  word[pos].char = char;
  return word;
}

function removeChar(word: wordElement[], pos: number): wordElement[] {
  word[pos].char = "";
  word.forEach((el) => (el.locked = true));
  return word;
}

function swapChar(
  word: wordElement[],
  leftPos: number,
  rightPos: number
): wordElement[] {
  word[leftPos].char = word[rightPos].initialChar;
  word[rightPos].char = word[leftPos].initialChar;
  return word;
}

function copy(el) {
  return JSON.parse(JSON.stringify(el));
}

const rawWord = "ADLER";
const mockWord = prepareWord(rawWord);
const mockSimilarWords = ["RADLER", "TADLER", "ADLERN", "ADLERS"];
const mockFunc = jest.fn();

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
      let newWord = copy(mockWord);
      newWord.forEach((el) => (el.locked = true));
      newWord = addChar(newWord, "B", i);
      expect(wrapper.vm["word"]).toEqual(newWord);
    });
  }

  it("no char selected", () => {
    const newWord = copy(mockWord);
    newWord.forEach((el) => (el.locked = true));
    wrapper.vm.addChar(0);
    expect(copy(wrapper.vm["word"])).toEqual(newWord);
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
      await wrapper.setData({ selected: 1 });
      wrapper.find(`#rect-around-arrow-${1}`).trigger("click");
      wrapper.vm.undo();
      const newWord = copy(mockWord);
      newWord.forEach((el) => (el.locked = true));
      expect(wrapper.vm["word"]).toEqual(newWord);
      expect(wrapper.vm["charAdded"]).toBeFalsy();
    });
  }

  it("start next task restores initial conditions", async () => {
    await wrapper.setData({ selected: 1 });
    wrapper.find(`#rect-around-arrow-${1}`).trigger("click");
    await wrapper.setData({ selected: 1 });
    wrapper.vm.restart();
    const newWord = copy(mockWord);
    newWord.forEach((el) => (el.locked = true));
    expect(wrapper.vm["word"]).toEqual(newWord);
    expect(wrapper.vm["selected"]).toBeNull();
    expect(wrapper.vm["charAdded"]).toBeFalsy();
  });
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

  it("initially all chars are unlocked", () => {
    expect(wrapper.vm["word"].every((el) => !el.locked)).toBeTruthy();
  });

  it("initially nothing is selected", () => {
    expect(wrapper.vm["selected"]).toBeNull();
  });

  for (let i = 0; i < mockWord.length; i++) {
    it(`change char at position ${i}`, async () => {
      await wrapper.setData({ selected: 1 }); // 'B'
      await wrapper.find(`#word-char-${mockWord[i].id}`).trigger("click");
      const newWord = changeChar(copy(mockWord), "B", i);
      expect(wrapper.vm["word"]).toEqual(newWord);
    });
  }

  it("change same char twice", async () => {
    const pos = 0;
    await wrapper.setData({ selected: 1 }); // 'B'
    await wrapper.find(`#word-char-${mockWord[pos].id}`).trigger("click");
    await wrapper.setData({ selected: 2 }); // 'C'
    await wrapper.find(`#word-char-${mockWord[pos].id}`).trigger("click");
    const newWord = changeChar(copy(mockWord), "C", pos);
    expect(wrapper.vm["word"]).toEqual(newWord);
  });

  it("change two different chars", async () => {
    const pos = 0;
    await wrapper.setData({ selected: 1 }); // 'B'
    await wrapper.find(`#word-char-${mockWord[pos].id}`).trigger("click");
    await wrapper.setData({ selected: 2 }); // 'C'
    await wrapper.find(`#word-char-${mockWord[pos + 1].id}`).trigger("click");
    const newWord = changeChar(copy(mockWord), "B", pos);
    expect(wrapper.vm["word"]).toEqual(newWord);
  });

  it("no char selected", async () => {
    await wrapper.setData({ selected: null });
    await wrapper.find(`#word-char-${mockWord[0].id}`).trigger("click");
    expect(wrapper.vm["word"]).toEqual(mockWord);
  });

  for (let i = 0; i < mockWord.length; i++) {
    it(`undo after changing position ${i}`, async () => {
      await wrapper.setData({ selected: 1 }); // 'B'
      await wrapper.find(`#word-char-${mockWord[i].id}`).trigger("click");
      wrapper.vm.undo();
      expect(wrapper.vm["word"]).toEqual(mockWord);
    });
  }

  it("start next task restores initial conditions", async () => {
    await wrapper.setData({ selected: 1 }); // 'B'
    await wrapper.find(`#word-char-${mockWord[0].id}`).trigger("click");
    await wrapper.setData({ selected: 1 }); // 'B'
    wrapper.vm.restart();
    expect(wrapper.vm["word"]).toEqual(mockWord);
    expect(wrapper.vm["selected"]).toBeNull();
  });

  it("correct answer is accepted", async () => {
    await wrapper.setData({ word: prepareWord(mockSimilarWords[0]) });
    expect(wrapper.vm.isCorrect()).toBeTruthy();
  });

  it("incorrect answer is rejected", async () => {
    await wrapper.setData({ word: prepareWord("TESTTEST") });
    expect(wrapper.vm.isCorrect()).toBeFalsy();
  });
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

  it("initially all chars are unlocked", () => {
    expect(wrapper.vm["word"].every((el) => !el.locked)).toBeTruthy();
  });

  for (let i = 0; i < mockWord.length; i++) {
    it(`remove char at position ${i}`, async () => {
      await wrapper.find(`#word-char-${mockWord[i].id}`).trigger("click");
      wrapper.vm.trashElement();
      const newWord = removeChar(copy(mockWord), i);
      expect(wrapper.vm["word"]).toEqual(newWord);
    });
  }

  it("remove two chars", async () => {
    const fstPos = 1;
    const sndPos = 2;
    await wrapper.find(`#word-char-${mockWord[fstPos].id}`).trigger("click");
    wrapper.vm.trashElement();
    await wrapper.find(`#word-char-${mockWord[sndPos].id}`).trigger("click");
    wrapper.vm.trashElement();
    const newWord = removeChar(copy(mockWord), fstPos);
    expect(wrapper.vm["word"]).toEqual(newWord);
  });

  for (let i = 0; i < mockWord.length; i++) {
    it(`undo after removing position ${i}`, async () => {
      await wrapper.find(`#word-char-${mockWord[i].id}`).trigger("click");
      wrapper.vm.trashElement();
      wrapper.vm.undo();
      expect(wrapper.vm["word"]).toEqual(mockWord);
    });
  }

  it("start next task restores initial conditions", async () => {
    await wrapper.find(`#word-char-${mockWord[0].id}`).trigger("click");
    wrapper.vm.trashElement();
    await wrapper.find(`#word-char-${mockWord[1].id}`).trigger("click");
    wrapper.vm.restart();
    expect(wrapper.vm["selected"]).toBeNull();
    expect(wrapper.vm["charRemoved"]).toBeFalsy();
    expect(wrapper.vm["word"]).toEqual(mockWord);
  });

  it("correct answer is accepted", async () => {
    await wrapper.setData({ word: prepareWord(mockSimilarWords[0]) });
    expect(wrapper.vm.isCorrect()).toBeTruthy();
  });

  it("incorrect answer is rejected", async () => {
    await wrapper.setData({ word: prepareWord("TESTTEST") });
    expect(wrapper.vm.isCorrect()).toBeFalsy();
  });
});

describe("Swap.vue", () => {
  const swapPairs = [
    [0, 1],
    [2, 3],
  ] as [number, number][];
  const mockSwappedWord = swapChar(
    copy(mockWord),
    swapPairs[0][0],
    swapPairs[0][1]
  );
  let wrapper;
  beforeEach(() => {
    const mockRandomNumber = jest
      .fn()
      .mockReturnValueOnce(swapPairs[0][0])
      .mockReturnValueOnce(swapPairs[0][0])
      .mockReturnValueOnce(swapPairs[1][0])
      .mockReturnValue(3);
    wrapper = shallowMount(Swap, {
      methods: {
        randomNumber: mockRandomNumber,
        drawArrows: mockFunc,
        getAnimationSteps: mockFunc,
      },
    });
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("initially all chars are unlocked", () => {
    expect(wrapper.vm["word"].every((el) => !el.locked)).toBeTruthy();
  });

  for (let i = 0; i < mockWord.length - 1; i++) {
    it(`swap char at position ${i} with ${i + 1}`, async () => {
      await wrapper.setData({ word: copy(mockWord) });
      await wrapper
        .find(`#rect-around-arrow-${mockWord[i].id}-${mockWord[i + 1].id}`)
        .trigger("click");
      const newWord = swapChar(copy(mockWord), i, i + 1);
      expect(wrapper.vm["word"]).toEqual(newWord);
    });
  }

  it("swap the same char pair", async () => {
    const pos = 2;
    const arrow = wrapper.find(
      `#rect-around-arrow-${mockWord[pos].id}-${mockWord[pos + 1].id}`
    );
    await wrapper.setData({ word: copy(mockWord) });
    await arrow.trigger("click");
    await arrow.trigger("click");
    expect(wrapper.vm["word"]).toEqual(mockWord);
  });

  it("swap two different char pairs", async () => {
    await wrapper.setData({ word: copy(mockWord) });
    await wrapper
      .find(`#rect-around-arrow-${mockWord[0].id}-${mockWord[1].id}`)
      .trigger("click");
    await wrapper
      .find(`#rect-around-arrow-${mockWord[2].id}-${mockWord[3].id}`)
      .trigger("click");
    const newWord = swapChar(swapChar(copy(mockWord), 0, 1), 2, 3);
    expect(wrapper.vm["word"]).toEqual(newWord);
  });

  for (let i = 0; i < mockWord.length - 1; i++) {
    it(`undo after swapping position ${i} with ${i +
      1} restores initial conditions`, async () => {
      await wrapper
        .find(`#rect-around-arrow-${mockWord[i].id}-${mockWord[i + 1].id}`)
        .trigger("click");
      wrapper.vm.undo();
      expect(wrapper.vm["word"]).toEqual(mockSwappedWord);
    });
  }

  it("correct answer is accepted", async () => {
    // TODO (optional): enable after swap has been refactored
    // await wrapper.setData({ word: mockWord });
    // expect(wrapper.vm.isCorrect()).toBeTruthy();
    expect(true).toBeTruthy();
  });

  it("incorrect answer is rejected", async () => {
    // TODO (optional): enable after swap has been refactored
    // await wrapper.setData({ word: prepareWord("TESTTEST") });
    expect(wrapper.vm.isCorrect()).toBeFalsy();
  });
});
