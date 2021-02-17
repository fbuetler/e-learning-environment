<template>
  <div @dragend="itemToAdd = null">
    <slot name="animation" :animationSteps="animationSteps" />
    <Difficulty
      :selected="currentDifficultyLevel"
      :difficultyLevels="difficultyLevels"
      @difficulty-selected="
        currentDifficultyLevel = $event;
        start();
      "
    />
    <div>
      Versuch das Baumsudoku zu lösen.
    </div>
    <div id="sudoku" class="flex-item flex-center">
      <table>
        <tbody>
          <tr>
            <!-- placeholder (top-left) -->
            <td></td>
            <!-- top view -->
            <td
              v-for="(visible, topIndex) in topView"
              :id="`top-view-${topIndex}`"
              :key="`top-view-${topIndex}`"
              class="card tree-view"
            >
              <span v-if="visible !== 0">{{ visible }}</span>
            </td>
            <!-- placeholder (top-right) -->
            <td></td>
          </tr>

          <tr v-for="(row, rowIndex) in values" :key="`row-${rowIndex}`">
            <!-- left view -->
            <td :id="`left-view-${rowIndex}`" class="card tree-view">
              <span v-if="leftView[rowIndex] !== 0">{{
                leftView[rowIndex]
              }}</span>
            </td>
            <!-- values -->
            <td
              v-for="field in row"
              :id="`field-${field.id}`"
              :key="`field-${field.id}`"
              :class="{ locked: field.locked }"
              class="dropzone tree-field responsive"
              @click="moveTree($event, field.id)"
              draggable
              @dragstart="moveTree($event, field.id)"
              @dragover.prevent
              @dragend.prevent
              @drop.stop.prevent="moveTree($event, field.id)"
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
            </td>
            <!-- right view -->
            <td :id="`right-view-${rowIndex}`" class="card tree-view">
              <span v-if="rightView[rowIndex] !== 0">{{
                rightView[rowIndex]
              }}</span>
            </td>
          </tr>

          <tr>
            <!-- placeholder (bottom-left) -->
            <td></td>
            <!-- bottom view -->
            <td
              v-for="(visible, bottomIndex) in bottomView"
              :id="`bottom-view-${bottomIndex}`"
              :key="`bottom-view-${bottomIndex}`"
              class="card tree-view"
            >
              <span v-if="visible !== 0">{{ visible }}</span>
            </td>
            <!-- placeholder (bottom-right) -->
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="interaction-container flex-item flex-row flex-center flex-stretch flex-wrap"
    >
      <ItemSelection
        :selected="itemToAdd"
        :items="items(size)"
        @selected="itemToAdd = $event"
      />
      <Trashcan @trashed-element="trashElement($event)" />
      <Undo @undo-operation="undo()" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "@/components/GameMixins.vue";
import TreesMixin from "@/components/trees/TreesMixin.vue";
import ItemSelection from "@/components/shared/ItemSelection.vue";
import Trashcan from "@/components/shared/Trashcan.vue";
import Undo from "@/components/shared/Undo.vue";
import Difficulty from "@/components/shared/Difficulty.vue";

type sudokuField = {
  id: number;
  value: number;
  locked: boolean;
};

type sudoku = sudokuField[][];

@Component<Sudoku>({
  components: {
    ItemSelection,
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

  itemToAdd = null;
  fieldToClean = null;
  animationSteps: Array<string> = null;

  currentDifficultyLevel = 1;
  difficultyLevels = 3;
  // states how many percent of the values are initially set
  minimalCoveragePerLevel: Map<number, number> = new Map([
    [1, 0.75], // size 3: 2 missing, size 4: 4 missing
    [2, 0.5], // size 3: 4 missing, size 4: 8 missing
    [3, 0], // only minimal amount of information given to solve the sudoku uniquely
  ]);
  LevelsWithNoViews = [1]; // no view values, only trees

  isInitialized(): boolean {
    return this.values !== null && this.views !== null;
  }

  start(): void {
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
    this.itemToAdd = null;
    this.fieldToClean = null;
    this.animationSteps = this.getAnimationSteps();
  }

  isCorrect(): boolean {
    return this.isValid(this.values, this.views, true);
  }

  generate(values: sudoku, views: number[][]): [sudoku, number[][]] {
    const [
      valuesComplete,
      emptyValueSlotRow,
      emptyValueSlotCol,
    ] = this.findEmptySlot(values.map((row) => row.map((col) => col.value)));
    if (valuesComplete) {
      return [values, views];
    }
    const [
      viewsComplete,
      emptyViewSlotRow,
      emptyViewSlotCol,
    ] = this.findEmptySlot(views);
    if (viewsComplete) {
      return [values, views];
    }

    const numbers: number[] = [];
    for (let i = 0; i < this.size; i++) {
      numbers[i] = i + 1;
    }
    this.shuffle(numbers);
    for (let i = 0; i < numbers.length; i++) {
      if (
        this.randomNumber(1) <= 0.5 ||
        this.LevelsWithNoViews.includes(this.currentDifficultyLevel)
      ) {
        values[emptyValueSlotRow][emptyValueSlotCol].value = numbers[i];
        values[emptyValueSlotRow][emptyValueSlotCol].locked = true;
      } else {
        views[emptyViewSlotRow][emptyViewSlotCol] = numbers[i];
      }
      if (this.isValid(values, views, false)) {
        const solutions = this.solve(values, views);
        if (solutions === 0) {
          values[emptyValueSlotRow][emptyValueSlotCol].value = 0;
          values[emptyValueSlotRow][emptyValueSlotCol].locked = false;
          views[emptyViewSlotRow][emptyViewSlotCol] = 0;
          continue;
        } else if (solutions === 1) {
          return [values, views];
        } else {
          return this.generate(values, views);
        }
      } else {
        values[emptyValueSlotRow][emptyValueSlotCol].value = 0;
        values[emptyValueSlotRow][emptyValueSlotCol].locked = false;
        views[emptyViewSlotRow][emptyViewSlotCol] = 0;
      }
    }
    return [values, views];
  }

  solve(values: sudoku, views: number[][]): number {
    const [complete, emptyValueSlotRow, emptyValueSlotCol] = this.findEmptySlot(
      values.map((row) => row.map((col) => col.value))
    );
    if (complete) {
      this.valuesSolution = JSON.parse(JSON.stringify(values)) as sudoku; // deep copy
      return 1;
    }

    let solutions = 0;
    for (let i = 1; i <= this.size; i++) {
      values[emptyValueSlotRow][emptyValueSlotCol].value = i;
      if (this.isValid(values, views, false)) {
        solutions += this.solve(values, views);
        if (solutions > 1) {
          break;
        }
      }
    }
    values[emptyValueSlotRow][emptyValueSlotCol].value = 0;
    return solutions;
  }

  findEmptySlot(slots: number[][]): [boolean, number, number] {
    const indexes = this.indexesInRandomOrder(
      slots.length,
      (slots[0] || []).length
    );
    for (let i = 0; i < indexes.length; i++) {
      const [row, col] = indexes[i];
      if (slots[row][col] === 0) {
        return [false, row, col];
      }
    }
    return [true, null, null];
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
    const values = JSON.parse(JSON.stringify(this.valuesSolution));
    values.forEach((row) => row.forEach((col) => (col.locked = true)));

    while (indexes.length > 0) {
      const [row, col] = indexes.shift();
      const tmpValue = values[row][col].value;
      values[row][col].value = 0;

      if (
        this.calculateValueCoverage(values) <
          this.minimalCoveragePerLevel.get(this.currentDifficultyLevel) ||
        this.solve(values, this.views) !== 1
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

  /*
    possible scenarios:
      - add new item: event by ItemSelection then place it
      - remove item: event by field then move it to Trashcan
      - move item: event by field then move it to another one
      - no locked field can be moved/removed
  */
  moveTree(event: Event, fieldID: number) {
    const [rowIndex, colIndex] = this.findFieldByID(fieldID);
    if (this.values[rowIndex][colIndex].locked) {
      return;
    }
    if (this.values[rowIndex][colIndex].value === 0) {
      // empty field -> set tree
      let oldFieldID: number;
      if (
        event instanceof DragEvent &&
        event.dataTransfer.getData("id") !== ""
      ) {
        oldFieldID = +event.dataTransfer.getData("id");
      } else if (this.fieldToClean !== null) {
        oldFieldID = this.fieldToClean;
        this.fieldToClean = null;
      } else {
        oldFieldID = null;
      }
      if (oldFieldID !== null) {
        const [oldRowIndex, oldColIndex] = this.findFieldByID(oldFieldID);
        if (this.values[oldRowIndex][oldColIndex].locked) {
          return;
        }
        this.itemToAdd = this.values[oldRowIndex][oldColIndex].value;
        Vue.set(this.values[oldRowIndex][oldColIndex], "value", 0);
      }
      if (this.itemToAdd === null) {
        return;
      }
      Vue.set(this.values[rowIndex][colIndex], "value", this.itemToAdd);
      this.itemToAdd = null;
    } else {
      // occupied field -> move/remove tree
      if (event instanceof DragEvent && event.type === "dragstart") {
        event.dataTransfer.setData("id", fieldID.toString());
      }
      this.fieldToClean = fieldID;
    }
  }

  trashElement(event: Event) {
    let fieldID: number;
    if (event instanceof DragEvent && event.dataTransfer.getData("id") !== "") {
      fieldID = +event.dataTransfer.getData("id");
    } else if (this.fieldToClean !== null) {
      fieldID = this.fieldToClean;
      this.fieldToClean = null;
    } else {
      return;
    }
    const [rowIndex, colIndex] = this.findFieldByID(fieldID);
    if (this.values[rowIndex][colIndex].locked) {
      return;
    }
    Vue.set(this.values[rowIndex][colIndex], "value", 0);
  }

  undo() {
    this.values.forEach((row) => {
      row.forEach((el) => {
        if (!el.locked) {
          el.value = 0;
        }
      });
    });
    this.itemToAdd = null;
    this.fieldToClean = null;
  }

  getAnimationSteps(): Array<string> {
    const wrongOrder = new Array<sudokuField>();
    const correctOrder = new Array<sudokuField>();
    for (let i = 0; i < this.values.length; i++) {
      for (let j = 0; j < this.values[i].length; j++) {
        if (!this.values[i][j].locked) {
          let value: number;
          do {
            value = Math.ceil(this.randomNumber(this.size));
          } while (value === this.valuesSolution[i][j].value);
          wrongOrder.push(this.createSudokuField(i, j, value, false));
          correctOrder.push(
            this.createSudokuField(i, j, this.valuesSolution[i][j].value, false)
          );
        }
      }
    }

    for (let i = 0; i < wrongOrder.length; i++) {
      let value: number;
      do {
        value = Math.ceil(this.randomNumber(this.size));
      } while (value === correctOrder[i].value);
      wrongOrder[i].value = value;
    }

    return wrongOrder
      .flatMap((field) => [
        `item-selection-${field.value}`,
        `field-${field.id}`,
      ])
      .concat(["button-menu-check", "undo"])
      .concat(
        correctOrder.flatMap((field) => [
          `item-selection-${field.value}`,
          `field-${field.id}`,
        ])
      )
      .concat(["button-menu-check", "button-menu-next"]);
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
