<template>
  <div>
    <div class="tree-container" :style="gridSize()">
      <div
        class="tree-row"
        :style="gridRowSizeAndPosition(`1 / 1`, `1 / ${size + 3}`)"
      >
        <!-- placeholder -->
        <div></div>
        <!-- top view -->
        <div
          class="card"
          v-for="(visible, topIndex) in views[0]"
          :key="`top-${topIndex}`"
        >
          <span v-if="visible !== 0">{{ visible }}</span>
          <span v-else></span>
        </div>
        <!-- placeholder -->
        <div></div>
      </div>

      <div
        class="tree-row"
        :style="
          gridRowSizeAndPosition(
            `${rowIndex + 2} / ${rowIndex + 2}`,
            `1 / ${size + 3}`
          )
        "
        v-for="(row, rowIndex) in values"
        :key="`row-${rowIndex}`"
      >
        <!-- left view -->
        <div class="card">
          <span v-if="views[1][rowIndex] !== 0">{{ views[1][rowIndex] }}</span>
          <span v-else></span>
        </div>
        <!-- values -->
        <div
          class="dropzone tree-dropzone"
          :class="{ locked: field.locked }"
          v-for="field in row"
          :key="`row-col-${field.id}`"
          @click="putTree($event, field.id)"
          draggable
          @dragstart="startDrag($event, field.id)"
          @dragover.prevent
          @dragend.prevent
          @drop.stop.prevent="putTree($event, field.id)"
        >
          <img
            v-if="field.value !== 0"
            :src="
              require('@/assets/trees/tree_' +
                field.value +
                '_' +
                size +
                '.png')
            "
          />
        </div>
        <!-- right view -->
        <div class="card">
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
        <div></div>
        <!-- bottom view -->
        <div
          class="card"
          v-for="(visible, bottomIndex) in views[3]"
          :key="`bottom-${bottomIndex}`"
        >
          <span v-if="visible !== 0">{{ visible }}</span>
          <span v-else></span>
        </div>
        <!-- placeholder -->
        <div></div>
      </div>
    </div>
    <div
      class="interaction-container flex-item flex-row flex-center flex-stretch"
    >
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
import TreesMixin from "./Trees";
import Trees from "@/components/trees/Trees.vue";
import Trashcan from "@/components/Trashcan.vue";
import Undo from "@/components/Undo.vue";

/*
  TODO: click placed tree and then trashcan to delete
*/

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
export default class Sudoku extends Mixins(GameMixin, TreesMixin)
  implements GameInterface {
  @Prop({ required: true })
  private args!: { size: number };

  private size: number = this.args.size;

  private values: sudoku = null;
  private views: number[][] = null;

  private valuesSolution: number[][] = null;

  private selectedTree = 0;

  isStarted(): boolean {
    return this.values === null || this.views === null;
  }

  restartGame(): void {
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

  isCorrect(): boolean {
    return this.isValid(this.values, this.views, true);
  }

  putTree(event: Event, id: number) {
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

  generate(values: sudoku, views: number[][]): [sudoku, number[][]] {
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

  solve(values: sudoku, views: number[][], solutions: number): number {
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

  findEmptySlot(slots: number[][]): [number, number] {
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

  isValid(values: sudoku, views: number[][], complete: boolean): boolean {
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

  createSudokuField(
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

  gridSize(): string {
    return `grid-template-rows: 0.5fr repeat(${this.size}, 1fr) 0.5fr;`;
  }

  gridRowSizeAndPosition(rowIndex: string, colIndex: string): string {
    return `grid-template-columns: 0.3fr repeat(${this.size}, 1fr) 0.3fr ; grid-row: ${rowIndex}; grid-column: ${colIndex};`;
  }

  startDrag(event: DragEvent, id: number) {
    event.dataTransfer.setData("id", id.toString());
  }

  trashElement(event: DragEvent) {
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

  undo() {
    this.values.forEach((row) => {
      row.forEach((el) => {
        el.value = el.initialValue;
      });
    });
  }
}
</script>

<style scoped>
.tree-container {
  display: grid;
}
.tree-row {
  display: grid;
}
.tree-row > div {
  display: flex;
  justify-content: center;
  display: -ms-flexbox;
  display: -webkit-flex;
  -ms-flex-align: center;
}
.card {
  align-items: center;
}
</style>
