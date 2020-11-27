<template>
  <div>
    <div class="wrapper" :style="gridSize()">
      <div class="view">{{ leftView }}</div>
      <div
        v-for="field in values"
        :key="field.id"
        @click="putTree(field.id)"
        draggable
        @dragstart="startDrag($event, field.id)"
        @dragover.prevent
        @dragend.prevent
        @drop.stop.prevent="putTree(field.id)"
      >
        <img
          v-if="field.value === 0"
          :src="require('@/assets/trees/tree_empty.png')"
        />
        <img
          v-else
          :src="require('@/assets/trees/tree_' + field.value + '.png')"
        />
      </div>
      <div class="view">{{ rightView }}</div>
    </div>
    <div class="interaction-container">
      <Selection
        :size="size"
        :selected="pickedTree"
        @change-selection="pickedTree = $event"
      />
      <Trashcan @trashed-element="(event) => trashElement(event)" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Selection from "@/components/trees/Selection.vue";
import Trashcan from "@/components/Trashcan.vue";
import { EventBus, EventBusEvents } from "../EventBus";

type rowField = { id: number; value: number; locked: boolean };
type row = rowField[];

@Component<Row>({
  components: {
    Selection,
    Trashcan,
  },
})
export default class Row extends Vue {
  @Prop({ required: true })
  private args!: { size: number };

  private size: number = this.args.size;

  private values: row = null;
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
    const row = this.values.map((field) => field.value);
    const visibleLeft = this.visibleTreesFromLeft(row);
    const visibleRight = this.visibleTreesFromLeft(row.slice().reverse());
    this.$emit(
      "evaluated-game",
      !(visibleLeft !== this.leftView || visibleRight !== this.rightView)
    );
  }

  private putTree(id: number): void {
    const field = this.values.find((el) => el.id == id);
    if (field.locked) {
      return;
    }
    Vue.set(field, "value", this.pickedTree);
    this.pickedTree = 0;
  }

  private generate(): [number, number, row] {
    const values: number[] = [];
    for (let i = 0; i < this.size; i++) {
      values[i] = i + 1;
    }
    this.shuffle(values);
    const row = new Array<rowField>(this.size);
    for (let i = 0; i < row.length; i++) {
      row[i] = this.createRowField(i, 0, false);
    }
    return [
      this.visibleTreesFromLeft(values),
      this.visibleTreesFromLeft(values.slice().reverse()),
      row,
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

  private createRowField(
    index: number,
    value: number,
    locked: boolean
  ): rowField {
    return {
      id: index,
      value: value,
      locked: locked,
    };
  }

  private gridSize(): string {
    return "grid-template-columns: repeat(" + (this.size + 2) + ",auto)";
  }

  private startDrag(event: DragEvent, id: number) {
    event.dataTransfer.setData("id", id.toString());
  }

  private trashElement(event: DragEvent) {
    const id = +event.dataTransfer.getData("id");
    if (this.values.find((el) => el.id === id).locked) {
      return;
    }
    Vue.set(this.values[id], "value", 0);
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
.interaction-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
}
</style>
