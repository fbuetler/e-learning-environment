<template>
  <div @dragend.prevent="selected = null">
    <Difficulty
      :selected="currentDifficultyLevel"
      :difficultyLevels="difficultyLevels"
      @difficulty-selected="currentDifficultyLevel = $event"
      v-if="displayDifficulty"
    />
    <div class="number" v-if="currentDifficultyLevel === 1">
      Stell die folgende Zahl dar:
    </div>
    <div class="number" v-else>
      Stell die folgende Zahl <b>mit möglichst wenig Münzen</b> dar:
    </div>
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
              v-for="(amount, i) in displaySelectedItems"
              :key="`item-${i}`"
            >
              <div
                :class="items(type).reverse()[i].class"
                v-for="j in amount"
                :key="`amount-${j}`"
              >
                <img
                  :src="require(`@/assets/${items(type).reverse()[i].img}`)"
                />
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
        :items="items(type).reverse()"
        @selected="selected = $event"
      />
      <Undo @undo-operation="undo()" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "@/components/GameMixins.vue";
import CoinsMixin, { coinType } from "@/components/coins/CoinsMixin.vue";
import ItemSelection from "@/components/ItemSelection.vue";
import Undo from "@/components/Undo.vue";
import Difficulty from "@/components/Difficulty.vue";

// TODO remove hack introduced in: reverse coin order (hack) - 2610ec49b17304ceade048cb94cacac793945b0a

@Component<To>({
  components: {
    ItemSelection,
    Undo,
    Difficulty,
  },
})
export default class To extends Mixins(GameMixin, CoinsMixin)
  implements GameInterface {
  @Prop({ required: true })
  args!: { coinType: coinType };

  type = this.args.coinType;

  selected: number = null;
  number: number = null;
  selectedItems: Array<number> = null;

  limit = 100;

  // there are only difficulty levels for coinType.NORMAL:
  // represent number with minimal amount of coints
  currentDifficultyLevel = 1;
  difficultyLevels = 2;

  isStarted(): boolean {
    return this.number === null;
  }

  restartGame() {
    this.number = Math.ceil(Math.random() * this.limit);
    this.selected = null;
    this.selectedItems = new Array<number>(this.items(this.type).length).fill(
      0
    );
  }

  isCorrect(): boolean {
    if (
      this.type === coinType.BINARY &&
      this.selectedItems.some((el) => el > 1)
    ) {
      return false;
    }
    let sum = 0;
    for (let i = 0; i < this.items(this.type).length; i++) {
      sum += this.selectedItems[i] * this.items(this.type)[i].value;
    }
    if (this.currentDifficultyLevel === 2 && this.type === coinType.NORMAL) {
      return (
        sum === this.number &&
        JSON.stringify(this.selectedItems) ===
          JSON.stringify(this.calcMinimalAmount(this.number))
      );
    }
    return sum === this.number;
  }

  calcMinimalAmount(number: number): number[] {
    const items = this.items(this.type);
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

  get displayDifficulty(): boolean {
    return this.type === coinType.NORMAL;
  }

  get displaySelectedItems(): number[] {
    return JSON.parse(JSON.stringify(this.selectedItems)).reverse();
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
