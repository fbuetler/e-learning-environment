<template>
  <div>
    <slot name="animation" :animationSteps="animationSteps" />
    <div>Welche Zahl wird hier dargestellt?</div>
    <div class="flex-item flex-center flex-col flex-flex card">
      <div>
        <div class="flex-item flex-center flex-row">
          <div v-for="index in generatedItems[nut]" :key="index" class="nut">
            <img :src="require('@/assets/mayas/nut.png')" />
          </div>
        </div>
        <div class="flex-item flex-center flex-col">
          <div
            v-for="index in generatedItems[stick]"
            :key="index"
            class="stick"
          >
            <img :src="require('@/assets/mayas/stick.png')" />
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div>Lösung:</div>
    <input
      id="answer-input"
      v-model.number="number"
      class="card big-text"
      size="5"
      type="number"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "@/components/GameMixins.vue";
import MayasMixin from "@/components/mayas/MayasMixin.vue";

@Component<From>({})
export default class From extends Mixins(GameMixin, MayasMixin)
  implements GameInterface {
  number: number = null;
  solution: number = null;
  generatedItems: Array<number> = null; // unfortunately Maps and Sets are not reactive in vue 2
  animationSteps: Array<string> = null;

  isStarted(): boolean {
    return this.generatedItems === null;
  }

  restartGame() {
    this.generatedItems = this.generateItems();
    this.solution = this.sumItems(this.generatedItems);
    this.animationSteps = this.getAnimationSteps();
    this.number = null;
  }

  isCorrect(): boolean {
    return this.number === this.solution;
  }

  getAnimationSteps(): Array<string> {
    return [
      `answer-input:${Math.ceil(Math.random() * this.limit)}`,
      "button-menu-check",
      `answer-input:${this.solution}`,
      "button-menu-check",
      "button-menu-next",
    ];
  }
}
</script>
