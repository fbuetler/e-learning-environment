import { shallowMount } from "@vue/test-utils";
import Row from "@/components/trees/Row.vue";
import Sudoku from "@/components/trees/Sudoku.vue";

// DragEvent not available in window
// https://github.com/jsdom/jsdom/issues/2913
Object.defineProperty(window, "DragEvent", {
  value: class DragEvent {},
});

function copy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

describe("Row.vue", () => {
  let wrapper;
  const size = 3;
  const leftView = 3;
  const rightView = 1;
  const values = [
    {
      id: 0,
      value: 0,
      locked: false,
    },
    {
      id: 1,
      value: 0,
      locked: false,
    },
    {
      id: 2,
      value: 0,
      locked: false,
    },
  ];
  const valuesSolution = [
    {
      id: 0,
      value: 1,
      locked: false,
    },
    {
      id: 1,
      value: 2,
      locked: false,
    },
    {
      id: 2,
      value: 3,
      locked: false,
    },
  ];
  beforeEach(() => {
    wrapper = shallowMount(Row, {
      propsData: {
        args: {
          size: size,
        },
      },
      data() {
        return {
          leftView: leftView,
          rightView: rightView,
          values: copy(values),
          valuesSolution: copy(valuesSolution),
        };
      },
    });
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("data injected correctly", () => {
    expect(wrapper.vm["leftView"]).toEqual(leftView);
    expect(wrapper.vm["rightView"]).toEqual(rightView);
    expect(wrapper.vm["values"]).toEqual(values);
    expect(wrapper.vm["valuesSolution"]).toEqual(valuesSolution);
  });

  it("initiall conditions hold", () => {
    expect(wrapper.vm["itemToAdd"]).toBeNull();
    expect(wrapper.vm["fieldToClean"]).toBeNull();
    expect(wrapper.vm["values"].every((el) => el.value === 0)).toBeTruthy();
  });

  it("put tree", async () => {
    const value = 1;
    const ID = 1;
    await wrapper.setData({ itemToAdd: value });
    await wrapper.find(`#field-${ID}`).trigger("click");
    expect(wrapper.vm["values"][ID].value).toBe(value);
    expect(wrapper.vm["itemToAdd"]).toBeNull();
  });

  it("move tree from field to free field", async () => {
    const value = 1;
    const ID = 1;
    const moveToID = 2;
    await wrapper.setData({ itemToAdd: value });
    await wrapper.find(`#field-${ID}`).trigger("click");
    expect(wrapper.vm["itemToAdd"]).toBeNull();
    await wrapper.find(`#field-${ID}`).trigger("click");
    expect(wrapper.vm["fieldToClean"]).toBe(ID);
    await wrapper.find(`#field-${moveToID}`).trigger("click");
    expect(wrapper.vm["values"][ID].value).toBe(0);
    expect(wrapper.vm["values"][moveToID].value).toBe(value);
    expect(wrapper.vm["itemToAdd"]).toBeNull();
    expect(wrapper.vm["fieldToClean"]).toBeNull();
  });

  it("move tree from field to occupied field", async () => {
    const value = 1;
    const anotherValue = 2;
    const ID = 1;
    const anotherID = 2;
    await wrapper.setData({ itemToAdd: value });
    await wrapper.find(`#field-${ID}`).trigger("click");
    expect(wrapper.vm["itemToAdd"]).toBeNull();
    await wrapper.setData({ itemToAdd: anotherValue });
    await wrapper.find(`#field-${anotherID}`).trigger("click");
    expect(wrapper.vm["itemToAdd"]).toBeNull();
    await wrapper.find(`#field-${ID}`).trigger("click");
    await wrapper.find(`#field-${anotherID}`).trigger("click");
    expect(wrapper.vm["values"][ID].value).toBe(value);
    expect(wrapper.vm["values"][anotherID].value).toBe(anotherValue);
  });

  it("move tree to trashcan", async () => {
    const value = 1;
    const ID = 1;
    await wrapper.setData({ itemToAdd: value });
    await wrapper.find(`#field-${ID}`).trigger("click");
    expect(wrapper.vm["itemToAdd"]).toBeNull();
    await wrapper.find(`#field-${ID}`).trigger("click");
    expect(wrapper.vm["fieldToClean"]).toBe(ID);
    wrapper.vm.trashElement(new Event("MouseEvent"));
    expect(wrapper.vm["values"][ID].value).toBe(0);
    expect(wrapper.vm["itemToAdd"]).toBeNull();
    expect(wrapper.vm["fieldToClean"]).toBeNull();
  });

  it("undo restores initial conditions", async () => {
    const value = 1;
    const ID = 1;
    await wrapper.setData({ itemToAdd: value });
    await wrapper.find(`#field-${ID}`).trigger("click");
    await wrapper.find(`#field-${ID}`).trigger("click");
    wrapper.vm.undo();
    expect(wrapper.vm["itemToAdd"]).toBeNull();
    expect(wrapper.vm["fieldToClean"]).toBeNull();
    expect(wrapper.vm["values"].every((el) => el.value === 0)).toBeTruthy();
  });

  it("next task restores initial conditions", async () => {
    const value = 1;
    const ID = 1;
    await wrapper.setData({ itemToAdd: value });
    await wrapper.find(`#field-${ID}`).trigger("click");
    await wrapper.setData({ itemToAdd: value });
    wrapper.vm.restartGame();
    expect(wrapper.vm["itemToAdd"]).toBeNull();
    expect(wrapper.vm["fieldToClean"]).toBeNull();
    expect(wrapper.vm["values"].every((el) => el.value === 0)).toBeTruthy();
  });

  it("correct answer is accepted", async () => {
    await wrapper.setData({ values: copy(valuesSolution) });
    expect(wrapper.vm.isCorrect()).toBeTruthy();
  });

  it("incorrect answer is rejected", async () => {
    expect(wrapper.vm.isCorrect()).toBeFalsy();
  });
});

describe("Sudoku.vue", () => {
  let wrapper;
  const size = 3;
  const views = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  const values = [
    [
      { id: 0, value: 0, initialValue: 0, locked: false },
      { id: 1, value: 0, initialValue: 0, locked: false },
      { id: 2, value: 2, initialValue: 2, locked: true },
    ],
    [
      { id: 3, value: 2, initialValue: 2, locked: true },
      { id: 4, value: 1, initialValue: 1, locked: true },
      { id: 5, value: 3, initialValue: 3, locked: true },
    ],
    [
      { id: 6, value: 3, initialValue: 3, locked: true },
      { id: 7, value: 2, initialValue: 2, locked: true },
      { id: 8, value: 1, initialValue: 1, locked: true },
    ],
  ];
  const valuesSolution = [
    [
      { id: 0, value: 1, initialValue: 0, locked: false },
      { id: 1, value: 3, initialValue: 3, locked: true },
      { id: 2, value: 2, initialValue: 2, locked: true },
    ],
    [
      { id: 3, value: 2, initialValue: 0, locked: true },
      { id: 4, value: 1, initialValue: 0, locked: true },
      { id: 5, value: 3, initialValue: 0, locked: true },
    ],
    [
      { id: 6, value: 3, initialValue: 0, locked: true },
      { id: 7, value: 2, initialValue: 2, locked: true },
      { id: 8, value: 1, initialValue: 0, locked: true },
    ],
  ];
  const freeFieldIDs = values
    .flat()
    .filter((el) => el.value === 0)
    .map((el) => el.id);

  beforeEach(() => {
    wrapper = shallowMount(Sudoku, {
      propsData: {
        args: {
          size: size,
        },
      },
      data() {
        return {
          views: copy(views),
          values: copy(values),
          valuesSolution: copy(valuesSolution),
        };
      },
    });
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("data injected correctly", () => {
    expect(wrapper.vm["views"]).toEqual(views);
    expect(wrapper.vm["values"]).toEqual(values);
    expect(wrapper.vm["valuesSolution"]).toEqual(valuesSolution);
  });

  it("initial conditions hold", () => {
    expect(wrapper.vm["itemToAdd"]).toBeNull();
    expect(wrapper.vm["fieldToClean"]).toBeNull();
  });

  it("put tree", async () => {
    const value = 1;
    expect(freeFieldIDs.length).toBeGreaterThan(0);
    const ID = freeFieldIDs[0];
    await wrapper.setData({ itemToAdd: value });
    await wrapper.find(`#field-${ID}`).trigger("click");
    expect(wrapper.vm["values"].flat().find((el) => el.id === ID).value).toBe(
      value
    );
    expect(wrapper.vm["itemToAdd"]).toBeNull();
  });

  it("move tree from field to free field", async () => {
    const value = 1;
    expect(freeFieldIDs.length).toBeGreaterThan(1);
    const ID = freeFieldIDs[0];
    const moveToID = freeFieldIDs[1];
    await wrapper.setData({ itemToAdd: value });
    await wrapper.find(`#field-${ID}`).trigger("click");
    expect(wrapper.vm["itemToAdd"]).toBeNull();
    await wrapper.find(`#field-${ID}`).trigger("click");
    expect(wrapper.vm["fieldToClean"]).toBe(ID);
    await wrapper.find(`#field-${moveToID}`).trigger("click");
    expect(wrapper.vm["values"].flat().find((el) => el.id === ID).value).toBe(
      0
    );
    expect(
      wrapper.vm["values"].flat().find((el) => el.id === moveToID).value
    ).toBe(value);
    expect(wrapper.vm["itemToAdd"]).toBeNull();
    expect(wrapper.vm["fieldToClean"]).toBeNull();
  });

  it("move tree from field to occupied field", async () => {
    const value = 1;
    const anotherValue = 2;
    expect(freeFieldIDs.length).toBeGreaterThan(1);
    const ID = freeFieldIDs[0];
    const moveToID = freeFieldIDs[1];
    await wrapper.setData({ itemToAdd: value });
    await wrapper.find(`#field-${ID}`).trigger("click");
    expect(wrapper.vm["itemToAdd"]).toBeNull();
    await wrapper.setData({ itemToAdd: anotherValue });
    await wrapper.find(`#field-${moveToID}`).trigger("click");
    expect(wrapper.vm["itemToAdd"]).toBeNull();
    await wrapper.find(`#field-${ID}`).trigger("click");
    await wrapper.find(`#field-${moveToID}`).trigger("click");
    expect(wrapper.vm["values"].flat().find((el) => el.id === ID).value).toBe(
      value
    );
    expect(
      wrapper.vm["values"].flat().find((el) => el.id === moveToID).value
    ).toBe(anotherValue);
  });

  it("move tree to trashcan", async () => {
    const value = 1;
    expect(freeFieldIDs.length).toBeGreaterThan(0);
    const ID = freeFieldIDs[0];
    await wrapper.setData({ itemToAdd: value });
    await wrapper.find(`#field-${ID}`).trigger("click");
    expect(wrapper.vm["itemToAdd"]).toBeNull();
    await wrapper.find(`#field-${ID}`).trigger("click");
    expect(wrapper.vm["fieldToClean"]).toBe(ID);
    wrapper.vm.trashElement(new Event("MouseEvent"));
    expect(wrapper.vm["values"].flat().find((el) => el.id === ID).value).toBe(
      0
    );
    expect(wrapper.vm["itemToAdd"]).toBeNull();
    expect(wrapper.vm["fieldToClean"]).toBeNull();
  });

  it("undo restores initial conditions", async () => {
    const value = 1;
    const ID = freeFieldIDs[0];
    await wrapper.setData({ itemToAdd: value });
    await wrapper.find(`#field-${ID}`).trigger("click");
    await wrapper.find(`#field-${ID}`).trigger("click");
    wrapper.vm.undo();
    expect(wrapper.vm["itemToAdd"]).toBeNull();
    expect(wrapper.vm["fieldToClean"]).toBeNull();
  });

  it("next task restors initial conditions", async () => {
    const value = 1;
    expect(freeFieldIDs.length).toBeGreaterThan(0);
    const ID = freeFieldIDs[0];
    await wrapper.setData({ itemToAdd: value });
    await wrapper.find(`#field-${ID}`).trigger("click");
    await wrapper.setData({ itemToAdd: value });
    wrapper.vm.restartGame();
    expect(wrapper.vm["itemToAdd"]).toBeNull();
    expect(wrapper.vm["fieldToClean"]).toBeNull();
  });

  it("correct answer is accepted", async () => {
    await wrapper.setData({ values: valuesSolution });
    expect(wrapper.vm.isCorrect()).toBeTruthy();
  });

  it("incorrect answer is rejected", () => {
    expect(wrapper.vm.isCorrect()).toBeFalsy();
  });
});
