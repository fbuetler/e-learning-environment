<template>
  <div @dragend.prevent="selected = null">
    <div class="number">Stell die folgende Zahl dar:</div>
    <div class="big-text">{{ number }}</div>
    <div
      class="flex-item flex-center flex-col flex-flex dropzone"
      @click="addItem()"
      @dragover.prevent
      @dragend.prevent
      @drop.stop.prevent="addItem()"
    >
      <div v-if="nothingSelected">
        Platziere hier die Münzen
      </div>
      <div v-else>
        <slot>
          <div class="flex-item flex-center flex-row">
            <div
              class="flex-item flex-center flex-col"
              v-for="(amount, i) in selectedItems"
              :key="`item-${i}`"
            >
              <div
                :class="items[i].class"
                v-for="j in amount"
                :key="`amount-${j}`"
              >
                <img :src="require(`@/assets/${items[i].img}`)" />
              </div>
            </div>
          </div>
        </slot>
      </div>
    </div>
    <hr />
    <div
      class="interaction-container flex-item flex-row flex-center flex-stretch"
    >
      <ItemSelection
        :selected="selected"
        :items="items"
        @selected="selected = $event"
      />
      <Undo @undo-operation="undo()" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "@/components/GameMixins";
import CoinsMixin, {
  normalCoins,
  binaryCoins,
} from "@/components/coins/CoinsMixin.vue";
import ItemSelection, { item } from "@/components/ItemSelection.vue";
import Undo from "@/components/Undo.vue";

export enum coinType {
  NORMAL,
  BINARY,
}

@Component<To>({
  components: {
    ItemSelection,
    Undo,
  },
})
export default class To extends Mixins(GameMixin, CoinsMixin)
  implements GameInterface {
  @Prop({ required: true })
  args!: { coinType: coinType };

  coinType = this.args.coinType;

  selected: number = null;
  number: number = null;
  selectedItems: Array<number> = null;

  limit = 100;

  isStarted(): boolean {
    return this.number === null;
  }

  restartGame() {
    this.number = Math.ceil(Math.random() * this.limit);
    this.selected = null;
    this.selectedItems = new Array<number>(this.items.length).fill(0);
  }

  isCorrect(): boolean {
    if (
      this.coinType === coinType.BINARY &&
      this.selectedItems.some((el) => el > 1)
    ) {
      return false;
    }
    let sum = 0;
    for (let i = 0; i < this.items.length; i++) {
      sum += this.selectedItems[i] * this.items[i].value;
    }
    return sum === this.number;
  }

  addItem() {
    if (this.selected === null) {
      return;
    }
    Vue.set(
      this.selectedItems,
      this.selected,
      this.selectedItems[this.selected] + 1
    );
    this.selected = null;
  }

  undo() {
    for (let i = 0; i < this.selectedItems.length; i++) {
      Vue.set(this.selectedItems, i, 0);
    }
  }

  get nothingSelected(): boolean {
    return this.selectedItems.every((el) => el === 0);
  }

  get items(): item[] {
    switch (this.coinType) {
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
            type: normalCoins.FIFE,
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
}
</script>

<style scoped>
.number {
  margin: 1em;
}
.dropzone {
  min-height: 5em;
}
</style>
