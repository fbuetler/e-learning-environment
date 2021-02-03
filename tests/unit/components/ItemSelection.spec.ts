import { shallowMount } from "@vue/test-utils";
import ItemSelection from "@/components/shared/ItemSelection.vue";

describe("ItemSelection.vue", () => {
  let wrapper;
  const selected = 1;
  const items: Array<{
    id: number;
    type: number;
    value: number;
    img: string;
    class: string;
  }> = [
    {
      id: 1,
      type: 1,
      value: 42,
      img: "beavers/beavers.png",
      class: "",
    },
    {
      id: 2,
      type: 3,
      value: 27,
      img: "text",
      class: "duda",
    },
  ];
  beforeEach(() => {
    wrapper = shallowMount(ItemSelection, {
      propsData: {
        selected: selected,
        items: items,
      },
    });
  });

  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("image items are rendered correctly", async () => {
    const imgItems = wrapper
      .find(`#item-selection-${items[0].id}`)
      .element.getElementsByTagName("img");
    expect(imgItems).toBeTruthy();
    expect(imgItems.length).toBe(1);
  });

  it("text items are rendered correctly", () => {
    const divItems = wrapper
      .find(`#item-selection-${items[1].id}`)
      .element.getElementsByTagName("div");
    expect(divItems).toBeTruthy();
    expect(divItems.length).toBe(1);
  });

  for (let i = 0; i < items.length; i++) {
    it(`event triggered if clicked on item ${i}`, async () => {
      await wrapper.find(`#item-selection-${items[i].id}`).trigger("click");
      expect(wrapper.emitted("selected")).toBeTruthy();
      expect(wrapper.emitted("selected").length).toBe(1);
      expect(wrapper.emitted("selected")[0]).toEqual([items[i].type]);
    });
  }

  for (let i = 0; i < items.length; i++) {
    it(`event triggered if dragstart item ${i}`, async () => {
      await wrapper.find(`#item-selection-${items[i].id}`).trigger("dragstart");
      expect(wrapper.emitted("selected")).toBeTruthy();
      expect(wrapper.emitted("selected").length).toBe(1);
      expect(wrapper.emitted("selected")[0]).toEqual([items[i].type]);
    });
  }

  it("only selected item is highlighted", async () => {
    const selectedItem = wrapper.find(`#item-selection-${selected}`);
    expect(selectedItem.element.className).toContain("selected");
    const selectedItems = wrapper.findAll(".selected");
    expect(selectedItems.length).toBe(1);
  });
});
