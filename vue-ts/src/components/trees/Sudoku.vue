<template>
  <div @dragend="selectedTree = null">
    <Difficulty
      :selected="currentDifficultyLevel"
      :difficultyLevels="difficultyLevels"
      @difficulty-selected="changeDifficultyLevel($event)"
    />
    <div>
      Versuch das Baumsudoku zu lösen.
    </div>
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
          v-for="(visible, topIndex) in topView"
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
          <span v-if="leftView[rowIndex] !== 0">{{ leftView[rowIndex] }}</span>
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
          <span v-if="rightView[rowIndex] !== 0">{{
            rightView[rowIndex]
          }}</span>
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
          v-for="(visible, bottomIndex) in bottomView"
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
import GameMixin, { GameInterface } from "@/components/GameMixins";
import TreesMixin from "@/components/trees/TreesMixin.vue";
import Trees from "@/components/trees/Trees.vue";
import Trashcan from "@/components/Trashcan.vue";
import Undo from "@/components/Undo.vue";
import Difficulty from "@/components/Difficulty.vue";

/*
  TODO:
    - click placed tree and then trashcan to delete
    - restyle grid, especially that it fits on one page
      (https://css-tricks.com/scaled-proportional-blocks-with-css-and-javascript/)
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
    Difficulty,
  },
})
export default class Sudoku extends Mixins(GameMixin, TreesMixin)
  implements GameInterface {
  @Prop({ required: true })
  args!: { size: number };

  size: number = this.args.size;

  values: sudoku = null;
  views: number[][] = null;

  valuesSolution: sudoku = null;

  selectedTree = null;

  currentDifficultyLevel = 1;
  difficultyLevels = 3;
  // states how many percent of the values are initially set
  minimalCoveragePerLevel: Map<number, number> = new Map([
    [1, 0.75], // size 3: 2 missing, size 4: 4 missing
    [2, 0.5], // size 3: 4 missing, size 4: 8 missing
    [3, 0], // only minimal amount of information given to solve the sudoku uniquely
  ]);
  LevelsWithNoViews = [1]; // no view values, only trees

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

    this.values = this.guaranteeMinimalCoverage();
  }

  isCorrect(): boolean {
    return this.isValid(this.values, this.views, true);
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
      if (
        Math.random() <= 0.5 ||
        this.LevelsWithNoViews.includes(this.currentDifficultyLevel)
      ) {
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
      // this is possibly overwritten several times until a unique solution is found
      this.valuesSolution = JSON.parse(JSON.stringify(values)) as sudoku; // deep copy
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
    const indexes = this.indexesInRandomOrder(
      slots.length,
      (slots[0] || []).length
    );
    for (let i = 0; i < indexes.length; i++) {
      const [row, col] = indexes[i];
      if (slots[row][col] === 0) {
        return [row, col];
      }
    }
    return [null, null];
  }

  indexesInRandomOrder(rows: number, cols: number): [number, number][] {
    const indexes: [number, number][] = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        indexes.push([i, j]);
      }
    }
    this.shuffle(indexes);
    return indexes;
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

  guaranteeMinimalCoverage(): sudoku {
    const indexes = this.indexesInRandomOrder(this.size, this.size);
    const values = JSON.parse(JSON.stringify(this.valuesSolution)) as sudoku;
    values.forEach((row) => row.forEach((col) => (col.locked = true)));

    while (indexes.length > 0) {
      const [row, col] = indexes.shift();
      const tmpValue = values[row][col].value;
      values[row][col].value = 0;

      if (
        this.calculateValueCoverage(values) <
          this.minimalCoveragePerLevel.get(this.currentDifficultyLevel) ||
        this.solve(values, this.views, 0) !== 1
      ) {
        values[row][col].value = tmpValue;
        break;
      }
      values[row][col].locked = false;
    }
    values.forEach((row) =>
      row.forEach((col) => (col.initialValue = col.value))
    );
    return values;
  }

  calculateValueCoverage(values: sudoku): number {
    const total = this.size * this.size;
    const covered = values.reduce(
      (rowSum, row) =>
        (rowSum += row.reduce(
          (colSum, col) => (colSum += col.value !== 0 ? 1 : 0),
          0
        )),
      0
    );
    return covered / total;
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

  findFieldByID(id: number): [number, number] {
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
    if (this.selectedTree === null) {
      return;
    }
    Vue.set(this.values[rowIndex][colIndex], "value", this.selectedTree);
    this.selectedTree = null;
  }

  startDrag(event: DragEvent, id: number) {
    event.dataTransfer.setData("id", id.toString());
  }

  trashElement(event: Event) {
    if (
      !(event instanceof DragEvent) ||
      event.dataTransfer.getData("id") === ""
    ) {
      return;
    }
    const id = +event.dataTransfer.getData("id");
    const [rowIndex, colIndex] = this.findFieldByID(id);
    if (this.values[rowIndex][colIndex].locked) {
      return;
    }
    Vue.set(this.values[rowIndex][colIndex], "value", 0);
  }

  undo() {
    this.values.forEach((row) => {
      row.forEach((el) => {
        el.value = el.initialValue;
      });
    });
  }

  gridSize(): string {
    return `grid-template-rows: 0.5fr repeat(${this.size}, 1fr) 0.5fr;`;
  }

  gridRowSizeAndPosition(rowIndex: string, colIndex: string): string {
    return `grid-template-columns: 0.3fr repeat(${this.size}, 1fr) 0.3fr ; grid-row: ${rowIndex}; grid-column: ${colIndex};`;
  }

  changeDifficultyLevel(level: number) {
    this.currentDifficultyLevel = level;
    this.restartGame();
  }

  get topView(): number[] {
    return this.views[0];
  }

  get leftView(): number[] {
    return this.views[1];
  }

  get rightView(): number[] {
    return this.views[2];
  }

  get bottomView(): number[] {
    return this.views[3];
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
  min-height: 1em;
}
</style>
