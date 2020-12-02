<template>
  <div>
    <div class="tree-container tree-row" :style="gridSize()">
      <div class="tree-view">{{ leftView }}</div>
      <div
        v-for="field in values"
        :key="field.id"
        @click="putTree($event, field.id)"
        draggable
        @dragstart="startDrag($event, field.id)"
        @dragover.prevent
        @dragend.prevent
        @drop.stop.prevent="putTree($event, field.id)"
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
      <div class="tree-view">{{ rightView }}</div>
    </div>
    <div class="interaction-container">
      <Trees
        :size="size"
        :selected="selectedTree"
        @tree-selected="selectedTree = $event"
      />
      <Trashcan @trashed-element="(event) => trashElement(event)" />
      <Undo @undo-operation="undo($event)" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "../Game";
import Trees from "@/components/trees/Trees.vue";
import Undo from "@/components/Undo.vue";
import Trashcan from "@/components/Trashcan.vue";

type rowField = {
  id: number;
  value: number;
  initialValue: number;
  locked: boolean;
};
type row = rowField[];

@Component<Row>({
  components: {
    Trees,
    Trashcan,
    Undo,
  },
})
export default class Row extends Mixins(GameMixin) implements GameInterface {
  @Prop({ required: true })
  private args!: { size: number };

  private size: number = this.args.size;

  private values: row = null;
  private leftView: number = null;
  private rightView: number = null;

  private selectedTree = 0;

  isStarted(): boolean {
    return (
      this.values === null || this.leftView === null || this.rightView === null
    );
  }

  restartGame(): void {
    [this.leftView, this.rightView, this.values] = this.generate();
  }

  isCorrect(): boolean {
    const row = this.values.map((field) => field.value);
    const visibleLeft = this.visibleTreesFromLeft(row);
    const visibleRight = this.visibleTreesFromLeft(row.slice().reverse());
    return !(visibleLeft !== this.leftView || visibleRight !== this.rightView);
  }

  putTree(event: Event, id: number): void {
    const field = this.values.find((el) => el.id == id);
    if (field.locked) {
      return;
    }
    if (event instanceof DragEvent && event.dataTransfer.getData("id") !== "") {
      const oldID = +event.dataTransfer.getData("id");
      const oldField = this.values.find((el) => el.id === oldID);
      if (oldField.locked) {
        return;
      }
      this.selectedTree = oldField.value;
      Vue.set(oldField, "value", 0);
    }
    if (this.selectedTree === 0) {
      return;
    }
    Vue.set(field, "value", this.selectedTree);
    this.selectedTree = 0;
  }

  generate(): [number, number, row] {
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

  shuffle(arr: number[]): void {
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

  visibleTreesFromLeft(trees: number[]): number {
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

  createRowField(index: number, value: number, locked: boolean): rowField {
    return {
      id: index,
      value: value,
      initialValue: value,
      locked: locked,
    };
  }

  gridSize(): string {
    return "grid-template-columns: repeat(" + (this.size + 2) + ",auto)";
  }

  startDrag(event: DragEvent, id: number) {
    event.dataTransfer.setData("id", id.toString());
  }

  trashElement(event: DragEvent) {
    const id = +event.dataTransfer.getData("id");
    if (this.values.find((el) => el.id === id).locked) {
      return;
    }
    Vue.set(this.values[id], "value", 0);
  }

  undo() {
    this.values.forEach((el) => {
      el.value = el.initialValue;
    });
  }
}
</script>
