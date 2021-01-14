<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { item } from "@/components/ItemSelection.vue";

export enum normalCoins {
  ONE,
  TWO,
  FIVE,
  TEN,
  TWENTY,
  FIFTY,
}

export enum binaryCoins {
  ONE,
  TWO,
  FOUR,
  EIGHT,
  SIXTEEN,
  THIRTYTWO,
  SIXTYFOUR,
}

export enum coinType {
  NORMAL,
  BINARY,
}

@Component
export default class CoinsMixin extends Vue {
  maxItemsNormal = new Map([
    [normalCoins.ONE, 5],
    [normalCoins.TWO, 5],
    [normalCoins.FIVE, 3],
    [normalCoins.TEN, 3],
    [normalCoins.TWENTY, 2],
    [normalCoins.FIFTY, 2],
  ]);

  items(type: coinType): item[] {
    switch (type) {
      case coinType.NORMAL: {
        return [
          {
            id: 1,
            type: normalCoins.ONE,
            value: 1,
            img: "coins/normal/one.png",
            class: "coin",
          },
          {
            id: 2,
            type: normalCoins.TWO,
            value: 2,
            img: "coins/normal/two.png",
            class: "coin",
          },
          {
            id: 3,
            type: normalCoins.FIVE,
            value: 5,
            img: "coins/normal/five.png",
            class: "coin",
          },
          {
            id: 4,
            type: normalCoins.TEN,
            value: 10,
            img: "coins/normal/ten.png",
            class: "coin",
          },
          {
            id: 5,
            type: normalCoins.TWENTY,
            value: 20,
            img: "coins/normal/twenty.png",
            class: "coin",
          },
          {
            id: 6,
            type: normalCoins.FIFTY,
            value: 50,
            img: "coins/normal/fifty.png",
            class: "coin",
          },
        ];
      }
      case coinType.BINARY: {
        return [
          {
            id: 1,
            type: binaryCoins.ONE,
            value: 1,
            img: "coins/binary/one.png",
            class: "coin",
          },
          {
            id: 2,
            type: binaryCoins.TWO,
            value: 2,
            img: "coins/binary/two.png",
            class: "coin",
          },
          {
            id: 3,
            type: binaryCoins.FOUR,
            value: 4,
            img: "coins/binary/four.png",
            class: "coin",
          },
          {
            id: 4,
            type: binaryCoins.EIGHT,
            value: 8,
            img: "coins/binary/eight.png",
            class: "coin",
          },
          {
            id: 5,
            type: binaryCoins.SIXTEEN,
            value: 16,
            img: "coins/binary/sixteen.png",
            class: "coin",
          },
          {
            id: 6,
            type: binaryCoins.THIRTYTWO,
            value: 32,
            img: "coins/binary/thirtytwo.png",
            class: "coin",
          },
          {
            id: 7,
            type: binaryCoins.SIXTYFOUR,
            value: 64,
            img: "coins/binary/sixtyfour.png",
            class: "coin",
          },
        ];
      }
      default:
        return [];
    }
  }

  maxItems(type: coinType, index: number): number {
    switch (type) {
      case coinType.NORMAL: {
        return this.maxItemsNormal.get(index);
      }
      case coinType.BINARY: {
        return 1;
      }
      default: {
        return 0;
      }
    }
  }
}
</script>
