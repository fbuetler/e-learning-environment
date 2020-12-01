<template>
  <div>
    <div class="tree-container" :style="gridSize()">
      <div
        class="tree-row"
        :style="gridRowSizeAndPosition(`1 / 1`, `1 / ${size + 3}`)"
      >
        <!-- placeholder -->
        <div class="placeholder"></div>
        <!-- top view -->
        <div
          v-for="(visible, topIndex) in views[0]"
          :key="`top-${topIndex}`"
          class="tree-view"
        >
          <span v-if="visible !== 0">{{ visible }}</span>
          <span v-else></span>
        </div>
        <!-- placeholder -->
        <div class="placeholder"></div>
      </div>

      <div
        v-for="(row, rowIndex) in values"
        :key="`row-${rowIndex}`"
        class="tree-row"
        :style="
          gridRowSizeAndPosition(
            `${rowIndex + 2} / ${rowIndex + 2}`,
            `1 / ${size + 3}`
          )
        "
      >
        <!-- left view -->
        <div class="tree-view">
          <span v-if="views[1][rowIndex] !== 0">{{ views[1][rowIndex] }}</span>
          <span v-else></span>
        </div>
        <!-- values -->
        <div
          v-for="field in row"
          :key="`row-col-${field.id}`"
          :class="{ locked: field.locked }"
          @click="putTree($event, field.id)"
          draggable
          @dragstart="startDrag($event, field.id)"
          @dragover.prevent
          @dragend.prevent
          @drop.stop.prevent="putTree($event, field.id)"
        >
          <img
            v-if="field.value !== 0"
            :src="require('@/assets/trees/tree_' + field.value + '.png')"
          />
        </div>
        <!-- right view -->
        <div class="tree-view">
          <span v-if="views[2][rowIndex] !== 0">{{ views[2][rowIndex] }}</span>
          <span v-else></span>
        </div>
      </div>

      <div
        class="tree-row"
        :style="
          gridRowSizeAndPosition(`${size + 2} / ${size + 2}`, `1 / ${size + 3}`)
        "
      >
        <!-- placeholder -->
        <div class="placeholder"></div>
        <!-- bottom view -->
        <div
          v-for="(visible, bottomIndex) in views[3]"
          :key="`bottom-${bottomIndex}`"
          class="tree-view"
        >
          <span v-if="visible !== 0">{{ visible }}</span>
          <span v-else></span>
        </div>
        <!-- placeholder -->
        <div class="placeholder"></div>
      </div>
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
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Trees from "@/components/trees/Trees.vue";
import Trashcan from "@/components/Trashcan.vue";
import Undo from "@/components/Undo.vue";
import { EventBus, EventBusEvents } from "../EventBus";

type sudokuField = {
  id: number;
  value: number;
  initialValue: number;
  locked: boolean;
};
type sudoku = sudokuField[][];

@Component<Sudoku>({
  components: {
    Trees,
    Trashcan,
    Undo,
  },
})
export default class Sudoku extends Vue {
  @Prop({ required: true })
  private args!: { size: number };

  private size: number = this.args.size;

  private values: sudoku = null;
  private views: number[][] = null;

  private valuesSolution: number[][] = null;

  private selectedTree = 0;

  created() {
    if (this.values === null || this.views === null) {
      this.restartGame();
    }
    EventBus.$on(EventBusEvents.RestartGame, () => this.restartGame());
    EventBus.$on(EventBusEvents.EvaluateGame, () => this.evaluateGame());
  }

  public restartGame(): void {
    const v = new Array<sudokuField>(this.size)
      .fill(null)
      .map(() => new Array<sudokuField>(this.size).fill(null));

    for (let i = 0; i < v.length; i++) {
      for (let j = 0; j < v[i].length; j++) {
        v[i][j] = this.createSudokuField(i, j, 0, false);
      }
    }

    [this.values, this.views] = this.generate(
      v,
      new Array<number>(4)
        .fill(0)
        .map(() => new Array<number>(this.size).fill(0))
    );
  }

  public evaluateGame() {
    this.$emit("evaluated-game", this.isValid(this.values, this.views, true));
  }

  private putTree(event: Event, id: number) {
    const [rowIndex, colIndex] = this.findFieldByID(id);
    if (this.values[rowIndex][colIndex].locked) {
      return;
    }
    if (event instanceof DragEvent && event.dataTransfer.getData("id") !== "") {
      const oldID = +event.dataTransfer.getData("id");
      const [oldRowIndex, oldColIndex] = this.findFieldByID(oldID);
      if (this.values[oldRowIndex][oldColIndex].locked) {
        return;
      }
      this.selectedTree = this.values[oldRowIndex][oldColIndex].value;
      Vue.set(this.values[oldRowIndex][oldColIndex], "value", 0);
    }
    if (this.selectedTree === 0) {
      return;
    }
    Vue.set(this.values[rowIndex][colIndex], "value", this.selectedTree);
    this.selectedTree = 0;
  }

  private generate(values: sudoku, views: number[][]): [sudoku, number[][]] {
    const [emptyValueSlotRow, emptyValueSlotCol] = this.findEmptySlot(
      values.map((row) => row.map((col) => col.value))
    );
    if (emptyValueSlotRow === null || emptyValueSlotCol === null) {
      return [values, views];
    }
    const [emptyViewSlotRow, emptyViewSlotCol] = this.findEmptySlot(views);
    if (emptyValueSlotRow === null || emptyValueSlotCol === null) {
      return [values, views];
    }

    const numbers: number[] = [];
    for (let i = 0; i < this.size; i++) {
      numbers[i] = i + 1;
    }
    this.shuffle(numbers);
    for (let i = 0; i < numbers.length; i++) {
      if (Math.random() <= 0.5) {
        values[emptyValueSlotRow][emptyValueSlotCol] = this.createSudokuField(
          emptyValueSlotRow,
          emptyValueSlotCol,
          numbers[i],
          true
        );
      } else {
        views[emptyViewSlotRow][emptyViewSlotCol] = numbers[i];
      }
      if (this.isValid(values, views, false)) {
        const solutions = this.solve(values, views, 0);
        if (solutions === 0) {
          values[emptyValueSlotRow][emptyValueSlotCol] = this.createSudokuField(
            emptyValueSlotRow,
            emptyValueSlotCol,
            0,
            false
          );
          views[emptyViewSlotRow][emptyViewSlotCol] = 0;
          continue;
        } else if (solutions === 1) {
          return [values, views];
        } else {
          return this.generate(values, views);
        }
      } else {
        values[emptyValueSlotRow][emptyValueSlotCol] = this.createSudokuField(
          emptyValueSlotRow,
          emptyValueSlotCol,
          0,
          false
        );
        views[emptyViewSlotRow][emptyViewSlotCol] = 0;
      }
    }
    return [values, views];
  }

  private solve(values: sudoku, views: number[][], solutions: number): number {
    const [emptyValueSlotRow, emptyValueSlotCol] = this.findEmptySlot(
      values.map((row) => row.map((col) => col.value))
    );
    if (emptyValueSlotRow === null || emptyValueSlotCol === null) {
      this.valuesSolution = JSON.parse(JSON.stringify(values)); // deep copy
      return solutions + 1;
    }

    const numbers: number[] = [];
    for (let i = 0; i < this.size; i++) {
      numbers[i] = i + 1;
    }
    this.shuffle(numbers);
    for (let i = 0; i < numbers.length; i++) {
      values[emptyValueSlotRow][emptyValueSlotCol].value = numbers[i];
      if (this.isValid(values, views, false)) {
        solutions = this.solve(values, views, solutions);
        if (solutions > 1) {
          break;
        }
      }
    }
    values[emptyValueSlotRow][emptyValueSlotCol].value = 0;
    return solutions;
  }

  private findEmptySlot(slots: number[][]): [number, number] {
    const indexes: [number, number][] = [];
    for (let i = 0; i < slots.length; i++) {
      for (let j = 0; j < slots[i].length; j++) {
        indexes.push([i, j]);
      }
    }
    this.shuffle(indexes);
    for (let i = 0; i < indexes.length; i++) {
      const [row, col] = indexes[i];
      if (slots[row][col] === 0) {
        return [row, col];
      }
    }
    return [null, null];
  }

  private shuffle(arr: number[] | [number, number][]): void {
    let currentIndex = arr.length;
    let tempValue: number | [number, number];
    let randomIndex: number;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      tempValue = arr[currentIndex];
      arr[currentIndex] = arr[randomIndex];
      arr[randomIndex] = tempValue;
    }
  }

  private isValid(
    values: sudoku,
    views: number[][],
    complete: boolean
  ): boolean {
    for (let i = 0; i < values.length; i++) {
      const rowSeen = new Set<number>();
      const colSeen = new Set<number>();
      for (let j = 0; j < values[i].length; j++) {
        const traversal: [number, Set<number>][] = [
          [values[i][j].value, rowSeen],
          [values[j][i].value, colSeen],
        ];
        for (let k = 0; k < traversal.length; k++) {
          const [el, seen] = traversal[k];
          if (seen.has(el)) {
            return false;
          } else if (el === 0) {
            if (complete) {
              return false;
            }
            continue;
          } else {
            seen.add(el);
          }
        }
      }

      if (rowSeen.size === this.size) {
        const row = values[i].map((el) => el.value);
        const visible = this.getVisibleTrees(row);
        const visibleRev = this.getVisibleTrees(row.slice().reverse());
        if (
          (views[1][i] !== 0 && views[1][i] !== visible) ||
          (views[2][i] !== 0 && views[2][i] !== visibleRev)
        ) {
          return false;
        }
      }
      if (colSeen.size === this.size) {
        const col: number[] = [];
        for (let k = 0; k < values.length; k++) {
          col[k] = values[k][i].value;
        }
        const visible = this.getVisibleTrees(col);
        const visibleRev = this.getVisibleTrees(col.slice().reverse());
        if (
          (views[0][i] !== 0 && views[0][i] !== visible) ||
          (views[3][i] !== 0 && views[3][i] !== visibleRev)
        ) {
          return false;
        }
      }
    }
    return true;
  }

  private getVisibleTrees(values: number[]): number {
    let min = 0;
    let visible = 0;
    for (let i = 0; i < values.length; i++) {
      if (values[i] > min) {
        visible++;
        min = values[i];
      }
    }
    return visible;
  }

  private createSudokuField(
    rowIndex: number,
    colIndex: number,
    value: number,
    locked: boolean
  ): sudokuField {
    return {
      id: rowIndex * this.size + colIndex,
      value: value,
      initialValue: value,
      locked: locked,
    };
  }

  private gridSize(): string {
    return `grid-template-rows: repeat(${this.size + 2}, 1fr);`;
  }

  private gridRowSizeAndPosition(rowIndex: string, colIndex: string): string {
    return `grid-template-columns: repeat(${this.size +
      2}, 1fr); grid-row: ${rowIndex}; grid-column: ${colIndex};`;
  }

  private startDrag(event: DragEvent, id: number) {
    event.dataTransfer.setData("id", id.toString());
  }

  private trashElement(event: DragEvent) {
    const id = +event.dataTransfer.getData("id");
    const [rowIndex, colIndex] = this.findFieldByID(id);
    if (this.values[rowIndex][colIndex].locked) {
      return;
    }
    Vue.set(this.values[rowIndex][colIndex], "value", 0);
  }

  private findFieldByID(id: number): [number, number] {
    let rowIndex: number;
    let colIndex: number;
    for (let i = 0; i < this.values.length; i++) {
      for (let j = 0; j < this.values[i].length; j++) {
        if (this.values[i][j].id == id) {
          rowIndex = i;
          colIndex = j;
        }
      }
    }
    return [rowIndex, colIndex];
  }

  private undo() {
    this.values.forEach((row) => {
      row.forEach((el) => {
        el.value = el.initialValue;
      });
    });
  }
}
</script>

<style scoped>
.tree-row {
  display: grid;
}
.placeholder {
  background: black;
  border: none !important;
}
</style>
