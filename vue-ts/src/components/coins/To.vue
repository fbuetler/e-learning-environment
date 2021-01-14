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
                :class="items(coinType)[i].class"
                v-for="j in amount"
                :key="`amount-${j}`"
              >
                <img :src="require(`@/assets/${items(coinType)[i].img}`)" />
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
        :items="items(coinType)"
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
    this.selectedItems = new Array<number>(
      this.items(this.coinType).length
    ).fill(0);
  }

  isCorrect(): boolean {
    if (
      this.coinType === coinType.BINARY &&
      this.selectedItems.some((el) => el > 1)
    ) {
      return false;
    }
    let sum = 0;
    for (let i = 0; i < this.items(this.coinType).length; i++) {
      sum += this.selectedItems[i] * this.items(this.coinType)[i].value;
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
