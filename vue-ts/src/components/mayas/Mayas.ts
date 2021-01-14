import Vue from "vue";
import { Component } from "vue-property-decorator";
import { item } from "@/components/ItemSelection";

export enum itemType {
  NUT = 0,
  STICK = 1,
}

@Component
export default class MayasMixin extends Vue {
  maxItems = new Map([
    [itemType.NUT, 4],
    [itemType.STICK, 3],
  ]);

  itemValue = new Map([
    [itemType.NUT, 1],
    [itemType.STICK, 5],
  ]);

  generateItems(): Array<number> {
    const items = new Array<number>(Object.keys(itemType).length / 2);
    for (const type in itemType) {
      if (!isNaN(Number(type))) {
        items[+type] = Math.floor(
          Math.random() * (this.maxItems.get(+type) + 1)
        );
      }
    }
    if (items.reduce((acc, val) => acc && val === 0, true)) {
      items[0] = 1; // ensure it non empty
    }
    return items;
  }

  sumItems(items: Array<number>): number {
    return Object.keys(itemType)
      .filter((el) => !isNaN(Number(el)))
      .reduce((acc, type) => acc + items[+type] * this.itemValue.get(+type), 0);
  }

  get nut(): number {
    return itemType.NUT;
  }

  get stick(): number {
    return itemType.STICK;
  }

  get itemsList(): item[] {
    return [
      {
        id: 1,
        type: itemType.NUT,
        img: "mayas/nut.png",
        class: "nut",
      },
      {
        id: 2,
        type: itemType.STICK,
        img: "mayas/stick.png",
        class: "stick",
      },
    ];
  }
}
