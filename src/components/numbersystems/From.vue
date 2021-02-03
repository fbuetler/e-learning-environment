<template>
  <div>
    <slot name="animation" :animationSteps="animationSteps" />
    <div>Welche Summe wird hier dargestellt?</div>
    <ItemGroup :items="generatedItems" :itemConfig="items(type)" />
    <hr />
    <div>Lösung:</div>
    <div id="answer">
      <input
        id="answer-input"
        v-model.number="number"
        class="card big-text"
        size="5"
        type="number"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "@/components/GameMixins.vue";
import NumbersystemsMixin, {
  numbersystemType,
} from "@/components/numbersystems/NumbersystemsMixin.vue";
import ItemGroup from "@/components/numbersystems/ItemGroup.vue";

@Component<From>({
  components: {
    ItemGroup,
  },
})
export default class From extends Mixins(GameMixin, NumbersystemsMixin)
  implements GameInterface {
  @Prop({ required: true })
  args!: { numbersystemType: numbersystemType };
  type = this.args.numbersystemType;

  number: number = null;
  solution: number = null;
  generatedItems: Array<number> = null;
  animationSteps: Array<string> = null;

  isInitialized(): boolean {
    return this.generatedItems !== null;
  }

  start() {
    this.number = null;
    this.generatedItems = this.generateItems(this.type);
    this.solution = this.sumItems(this.type, this.generatedItems);
    this.animationSteps = this.getAnimationSteps();
  }

  isCorrect(): boolean {
    return this.number === this.solution;
  }

  getAnimationSteps(): Array<string> {
    return [
      `answer-input:${Math.ceil(Math.random() * this.limit(this.type))}`,
      "button-menu-check",
      `answer-input:${this.solution}`,
      "button-menu-check",
      "button-menu-next",
    ];
  }
}
</script>
