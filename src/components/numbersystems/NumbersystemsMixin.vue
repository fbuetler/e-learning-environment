<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { item } from "@/components/ItemSelection.vue";

export enum decimal {
  ONE,
  TWO,
  FIVE,
  TEN,
  TWENTY,
  FIFTY,
}

export enum binary {
  ONE,
  TWO,
  FOUR,
  EIGHT,
  SIXTEEN,
  THIRTYTWO,
  SIXTYFOUR,
}

export enum maya {
  ONE,
  FIVE,
}

export enum numbersystemType {
  DECIMAL,
  BINARY,
  MAYA,
}

@Component
export default class NumbersystemsMixin extends Vue {
  limit = 100;

  generateItems(type: numbersystemType): number[] {
    const items = new Array<number>(this.items(type).length).fill(0);
    for (let i = 0; i < items.length; i++) {
      items[i] = Math.floor(Math.random() * this.items(type)[i].max + 0.5);
    }
    if (items.every((el) => el === 0)) {
      items[0] = 1; // ensure it is non empty
    }
    return items;
  }

  sumItems(type: numbersystemType, items: number[]): number {
    let sum = 0;
    for (let i = 0; i < this.items(type).length; i++) {
      sum += items[i] * this.items(type)[i].value;
    }
    return sum;
  }

  calcMinimalAmount(type: numbersystemType, number: number): number[] {
    const items = this.items(type);
    items.sort((a, b) => a.value - b.value);
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

  mapNumberToActions(type: numbersystemType, number: number): string[] {
    const coins = this.calcMinimalAmount(number, type);
    return coins.flatMap((el, i) =>
      Array.from({ length: el }, () => [
        `item-selection-${i + 1}`, // item ids start with 1
        "dropzone",
      ]).flat()
    );
  }

  items(type: numbersystemType): item[] {
    switch (type) {
      case numbersystemType.DECIMAL: {
        return [
          {
            id: 1,
            type: decimal.ONE,
            value: 1,
            max: 5,
            img: "coins/normal/one.png",
            class: "coin",
          },
          {
            id: 2,
            type: decimal.TWO,
            value: 2,
            max: 5,
            img: "coins/normal/two.png",
            class: "coin",
          },
          {
            id: 3,
            type: decimal.FIVE,
            value: 5,
            max: 3,
            img: "coins/normal/five.png",
            class: "coin",
          },
          {
            id: 4,
            type: decimal.TEN,
            value: 10,
            max: 3,
            img: "coins/normal/ten.png",
            class: "coin",
          },
          {
            id: 5,
            type: decimal.TWENTY,
            value: 20,
            max: 2,
            img: "coins/normal/twenty.png",
            class: "coin",
          },
          {
            id: 6,
            type: decimal.FIFTY,
            value: 50,
            max: 2,
            img: "coins/normal/fifty.png",
            class: "coin",
          },
        ];
      }
      case numbersystemType.BINARY: {
        return [
          {
            id: 1,
            type: binary.ONE,
            value: 1,
            max: 1,
            img: "coins/binary/one.png",
            class: "coin",
          },
          {
            id: 2,
            type: binary.TWO,
            value: 2,
            max: 1,
            img: "coins/binary/two.png",
            class: "coin",
          },
          {
            id: 3,
            type: binary.FOUR,
            value: 4,
            max: 1,
            img: "coins/binary/four.png",
            class: "coin",
          },
          {
            id: 4,
            type: binary.EIGHT,
            value: 8,
            max: 1,
            img: "coins/binary/eight.png",
            class: "coin",
          },
          {
            id: 5,
            type: binary.SIXTEEN,
            value: 16,
            max: 1,
            img: "coins/binary/sixteen.png",
            class: "coin",
          },
          {
            id: 6,
            type: binary.THIRTYTWO,
            value: 32,
            max: 1,
            img: "coins/binary/thirtytwo.png",
            class: "coin",
          },
          {
            id: 7,
            type: binary.SIXTYFOUR,
            value: 64,
            max: 1,
            img: "coins/binary/sixtyfour.png",
            class: "coin",
          },
        ];
      }
      case numbersystemType.MAYA: {
        return [
          {
            id: 1,
            type: maya.ONE,
            value: 1,
            max: 4,
            img: "mayas/nut.png",
            class: "nut",
          },
          {
            id: 2,
            type: maya.FIVE,
            value: 5,
            max: 3,
            img: "mayas/stick.png",
            class: "stick",
          },
        ];
      }
      default:
        return [];
    }
  }
}
</script>
