import { shallowMount } from "@vue/test-utils";
import Add from "@/components/words/Add.vue";

jest.mock("@/components/words/Words", () => ({
  LoadWords() {
    return [
      [
        { id: 0, char: "A", initialChar: "A", locked: true },
        { id: 1, char: "D", initialChar: "D", locked: true },
        { id: 2, char: "L", initialChar: "L", locked: true },
        { id: 3, char: "E", initialChar: "E", locked: true },
        { id: 4, char: "R", initialChar: "R", locked: true },
      ],
      ["RADLER", "TADLER", "ADLERN", "ADLERS"],
    ];
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
    expect(wrapper.vm["word"].map((el) => el.char).join("")).toBe("ADLER");
  });
});
