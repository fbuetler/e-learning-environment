<template>
  <div>
    <div>Welche Zahl wird hier dargestellt?</div>
    <div class="flex-item flex-center flex-col flex-flex card">
      <slot>
        <div class="flex-item flex-center flex-row">
          <div
            class="flex-item flex-center flex-col"
            v-for="(amount, i) in generatedItems"
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
    <hr />
    <div>Lösung:</div>
    <input
      class="card big-text"
      size="5"
      v-model.number="number"
      type="number"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "@/components/GameMixins.vue";
import CoinsMixin, { coinType } from "@/components/coins/CoinsMixin.vue";

/*
  TODO
    - add tutorial animation
*/

@Component<From>({})
export default class From extends Mixins(GameMixin, CoinsMixin)
  implements GameInterface {
  @Prop({ required: true })
  args!: { coinType: coinType };

  coinType = this.args.coinType;
  number: number = null;
  generatedItems: Array<number> = null;

  isStarted(): boolean {
    return this.generatedItems === null;
  }

  restartGame() {
    this.generatedItems = this.generateItems(this.coinType);
  }

  isCorrect(): boolean {
    return this.number === this.sumItems(this.coinType, this.generatedItems);
  }
}
</script>
