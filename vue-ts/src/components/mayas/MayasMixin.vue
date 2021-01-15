<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { item } from "@/components/ItemSelection.vue";

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

  limit = 19;

  generateItems(): Array<number> {
    const items = new Array<number>(Object.keys(itemType).length / 2);
    for (const type in itemType) {
      if (!isNaN(Number(type))) {
        items[+type] = Math.floor(
          Math.random() * (this.maxItems.get(+type) + 1)
        );
      }
    }
    if (items.every((el) => el === 0)) {
      items[0] = 1; // ensure its non empty
    }
    return items;
  }

  sumItems(items: number[]): number {
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
      sum += items[i] * this.items[i].value;
    }
    return sum;
  }

  mapNumberToActions(number: number): string[] {
    const coins = this.calcMinimalAmount(number);
    return coins.flatMap((el, i) =>
      Array.from({ length: el }, () => [
        `item-selection-${i + 1}`, // item ids start with 1
        "dropzone",
      ]).flat()
    );
  }

  calcMinimalAmount(number: number): number[] {
    const items = this.items;
    let i = items.length - 1;
    const minimalAmount = new Array<number>(items.length).fill(0);
    while (number > 0 && i >= 0) {
      const coinValue = items[i].value;
      if (number >= coinValue) {
        minimalAmount[i]++;
        number -= coinValue;
      } else {
        i--;
      }
    }
    return minimalAmount;
  }

  get nut(): number {
    return itemType.NUT;
  }

  get stick(): number {
    return itemType.STICK;
  }

  get items(): item[] {
    return [
      {
        id: 1,
        type: itemType.NUT,
        value: 1,
        img: "mayas/nut.png",
        class: "nut",
      },
      {
        id: 2,
        type: itemType.STICK,
        value: 5,
        img: "mayas/stick.png",
        class: "stick",
      },
    ];
  }
}
</script>
