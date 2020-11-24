<template>
  <div>
    <div class="wrapper" :style="gridSize()">
      <div class="view">{{ leftView }}</div>
      <div
        v-for="(value, index) in values"
        :key="index"
        @click="putTree(index)"
      >
        <img
          v-if="value === 0"
          :src="require('@/assets/trees/tree_empty.png')"
        />
        <img v-else :src="require('@/assets/trees/tree_' + value + '.png')" />
      </div>
      <div class="view">{{ rightView }}</div>
    </div>
    <Selection
      :size="size"
      :selected="pickedTree"
      @change-selection="pickedTree = $event"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Selection from "@/components/trees/Selection.vue";
import { EventBus, EventBusEvents } from "../EventBus";

@Component<Row>({
  components: {
    Selection,
  },
})
export default class Row extends Vue {
  @Prop({ required: true })
  private args!: { size: number };

  private size: number = this.args.size;

  private values: number[] = null;
  private leftView: number = null;
  private rightView: number = null;

  private pickedTree = 0;

  created() {
    if (
      this.values === null ||
      this.leftView === null ||
      this.rightView === null
    ) {
      this.restartGame();
    }
    EventBus.$on(EventBusEvents.RestartGame, () => this.restartGame());
    EventBus.$on(EventBusEvents.EvaluateGame, () => this.evaluateGame());
  }

  private restartGame(): void {
    [this.leftView, this.rightView, this.values] = this.generate();
  }

  private evaluateGame() {
    const visibleLeft = this.visibleTreesFromLeft(this.values);
    const visibleRight = this.visibleTreesFromLeft(
      this.values.slice().reverse()
    );
    this.$emit(
      "evaluated-game",
      !(visibleLeft !== this.leftView || visibleRight !== this.rightView)
    );
  }

  private putTree(index: number): void {
    Vue.set(this.values, index, this.pickedTree);
    this.pickedTree = 0;
  }

  private generate(): [number, number, number[]] {
    const values: number[] = [];
    for (let i = 0; i < this.size; i++) {
      values[i] = i + 1;
    }
    this.shuffle(values);
    return [
      this.visibleTreesFromLeft(values),
      this.visibleTreesFromLeft(values.slice().reverse()),
      new Array<number>(this.size).fill(0),
    ];
  }

  private shuffle(arr: number[]): void {
    let currentIndex = arr.length;
    let tempValue: number;
    let randomIndex: number;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      tempValue = arr[currentIndex];
      arr[currentIndex] = arr[randomIndex];
      arr[randomIndex] = tempValue;
    }
  }

  private visibleTreesFromLeft(trees: number[]): number {
    let min = 0;
    let visible = 0;
    for (const tree of trees) {
      if (tree > min) {
        visible++;
        min = tree;
      }
    }
    return visible;
  }

  private gridSize(): string {
    return "grid-template-columns: repeat(" + (this.size + 2) + ",auto)";
  }
}
</script>

<style scoped>
.wrapper {
  display: grid;
  background: white;
  border: 3px solid black;
  margin: 0px 0px 25px 0px;
}
.wrapper > div {
  border: 1px solid gray;
  font-size: 3em;

  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}
.wrapper > div > img {
  max-height: 50%;
}
.view {
  background: lightgray;
  border: 1px solid gray;
}
</style>
