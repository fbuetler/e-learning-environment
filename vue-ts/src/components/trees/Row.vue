<template>
  <div>
    <div class="grid" :style="cellsPerRowWithViews">
      <div>{{ leftView }}</div>
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
      <div>{{ rightView }}</div>
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

@Component<Row>({
  components: {
    Selection,
  },
  watch: {
    initialize(newValue: boolean) {
      if (newValue) {
        this.initializeGame();
        this.$emit("initialized-game");
      }
    },
    evaluate(newValue: boolean) {
      if (newValue) {
        const correct = this.evaluateGame();
        this.$emit("evaluated-game", correct);
      }
    },
  },
})
export default class Row extends Vue {
  @Prop({ default: false })
  private initialize: boolean;
  @Prop({ default: false })
  private evaluate: boolean;
  @Prop({ required: true })
  private args!: { size: number };

  private size: number;

  private values: number[] = null;
  private leftView: number = null;
  private rightView: number = null;

  private pickedTree = 0;

  created() {
    this.size = this.args.size;
    this.initializeGame();
    this.$emit("initialized-game");
  }

  private initializeGame(): void {
    [this.leftView, this.rightView, this.values] = this.generate();
  }

  private evaluateGame(): boolean {
    const visibleLeft = this.visibleTreesFromLeft(this.values);
    const visibleRight = this.visibleTreesFromLeft(
      this.values.slice().reverse()
    );
    return !(visibleLeft !== this.leftView || visibleRight !== this.rightView);
  }

  private putTree(index: number): void {
    // TODO rm this after this.values is made reactive
    if (this.pickedTree === 0) {
      return;
    }
    this.values[index] = this.pickedTree;
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

  private get cellsPerRowWithViews(): string {
    return "grid-template-columns: repeat(" + (this.size + 2) + ",auto)";
  }
}
</script>

<style scoped>
.grid {
  display: grid;
  background: white;
  border: 3px solid black;
  margin: 0px 0px 25px 0px;
}
.grid > div {
  padding: 1rem;
  position: relative;
  border: 1px solid gray;
}
.grid > div::before {
  content: "";
  display: block;
  padding-bottom: 100%;
}
.grid > div img {
  position: absolute;
  max-width: 80%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
