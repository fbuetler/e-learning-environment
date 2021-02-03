<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { item } from "@/components/shared/ItemSelection.vue";

export enum decimal {
  FIFTY,
  TWENTY,
  TEN,
  FIVE,
  TWO,
  ONE,
}

export enum binary {
  SIXTYFOUR,
  THIRTYTWO,
  SIXTEEN,
  EIGHT,
  FOUR,
  TWO,
  ONE,
}

export enum maya {
  FIVE,
  ONE,
}

export enum numbersystemType {
  DECIMAL,
  BINARY,
  MAYA,
}

@Component
export default class NumbersystemsMixin extends Vue {
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
    if (items.length !== this.items(type).length) {
      throw Error(`array length to not match  ${items} ${this.items(type)}`);
    }
    for (let i = 0; i < this.items(type).length; i++) {
      sum += items[i] * this.items(type)[i].value;
    }
    return sum;
  }

  calcMinimalAmount(type: numbersystemType, number: number): number[] {
    const items = this.items(type);
    let i = 0;
    const minimalAmount = new Array<number>(items.length).fill(0);
    while (number > 0 && i < items.length) {
      const value = items[i].value;
      if (number >= value) {
        minimalAmount[i]++;
        number -= value;
      } else {
        i++;
      }
    }
    return minimalAmount;
  }

  mapNumberToActions(type: numbersystemType, number: number): string[] {
    return this.calcMinimalAmount(number, type).flatMap((el, i) =>
      Array.from({ length: el }, () => [
        `item-selection-${i + 1}`, // item ids start with 1
        "dropzone",
      ]).flat()
    );
  }

  limit(type: numbersystemType): number {
    switch (type) {
      case numbersystemType.DECIMAL: {
        return 100;
      }
      case numbersystemType.BINARY: {
        return 100;
      }
      case numbersystemType.MAYA: {
        return 19;
      }
      default: {
        return 100;
      }
    }
  }

  /*
    The order of items is tightly coupled to the code where this mixins is used in.
    The reason being is that vuejs 2 does not support reactive maps therefore
    and array is used and each entry in this array corresponds to an item in the same order.
  */
  items(type: numbersystemType): item[] {
    switch (type) {
      case numbersystemType.DECIMAL: {
        return [
          {
            id: 6,
            type: decimal.FIFTY,
            value: 50,
            max: 2,
            img: "numbersystems/decimal/fifty.png",
            class: "coin",
          },
          {
            id: 5,
            type: decimal.TWENTY,
            value: 20,
            max: 2,
            img: "numbersystems/decimal/twenty.png",
            class: "coin",
          },
          {
            id: 4,
            type: decimal.TEN,
            value: 10,
            max: 3,
            img: "numbersystems/decimal/ten.png",
            class: "coin",
          },
          {
            id: 3,
            type: decimal.FIVE,
            value: 5,
            max: 3,
            img: "numbersystems/decimal/five.png",
            class: "coin",
          },
          {
            id: 2,
            type: decimal.TWO,
            value: 2,
            max: 5,
            img: "numbersystems/decimal/two.png",
            class: "coin",
          },
          {
            id: 1,
            type: decimal.ONE,
            value: 1,
            max: 5,
            img: "numbersystems/decimal/one.png",
            class: "coin",
          },
        ];
      }
      case numbersystemType.BINARY: {
        return [
          {
            id: 7,
            type: binary.SIXTYFOUR,
            value: 64,
            max: 1,
            img: "numbersystems/binary/sixtyfour.png",
            class: "coin",
          },
          {
            id: 6,
            type: binary.THIRTYTWO,
            value: 32,
            max: 1,
            img: "numbersystems/binary/thirtytwo.png",
            class: "coin",
          },
          {
            id: 5,
            type: binary.SIXTEEN,
            value: 16,
            max: 1,
            img: "numbersystems/binary/sixteen.png",
            class: "coin",
          },
          {
            id: 4,
            type: binary.EIGHT,
            value: 8,
            max: 1,
            img: "numbersystems/binary/eight.png",
            class: "coin",
          },
          {
            id: 3,
            type: binary.FOUR,
            value: 4,
            max: 1,
            img: "numbersystems/binary/four.png",
            class: "coin",
          },
          {
            id: 2,
            type: binary.TWO,
            value: 2,
            max: 1,
            img: "numbersystems/binary/two.png",
            class: "coin",
          },
          {
            id: 1,
            type: binary.ONE,
            value: 1,
            max: 1,
            img: "numbersystems/binary/one.png",
            class: "coin",
          },
        ];
      }
      case numbersystemType.MAYA: {
        return [
          {
            id: 2,
            type: maya.FIVE,
            value: 5,
            max: 3,
            img: "numbersystems/mayas/stick.png",
            class: "stick",
          },
          {
            id: 1,
            type: maya.ONE,
            value: 1,
            max: 4,
            img: "numbersystems/mayas/nut.png",
            class: "nut",
          },
        ];
      }
      default:
        return [];
    }
  }
}
</script>
