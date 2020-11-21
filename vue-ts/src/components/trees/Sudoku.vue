<template>
  <div>
    <div class="wrapper" :style="gridSize()">
      <!-- placeholder -->
      <div :style="gridPosition(1, 1)"></div>
      <!-- top view -->
      <div
        v-for="(visible, topIndex) in views[0]"
        :key="`top-${topIndex}`"
        :style="gridPosition(1, topIndex + 2)"
      >
        {{ visible }}
      </div>
      <!-- placeholder -->
      <div :style="gridPosition(1, size + 2)"></div>
      <div
        v-for="(row, rowIndex) in values"
        :key="`row-${rowIndex}`"
        class="row"
        :style="
          gridRowSizeAndPosition(
            `${rowIndex + 2} / ${rowIndex + 2}`,
            `1 / ${size + 3}`
          )
        "
      >
        <!-- left view -->
        <div :style="gridPosition(1, 0)">{{ views[1][rowIndex] }}</div>
        <!-- values -->
        <div
          v-for="(value, colIndex) in row"
          :key="`col-${colIndex}`"
          :style="gridPosition(1, 0)"
          @click="putTree(rowIndex, colIndex)"
        >
          <img
            v-if="value === 0"
            :src="require('@/assets/trees/tree_empty.png')"
          />
          <img v-else :src="require('@/assets/trees/tree_' + value + '.png')" />
        </div>
        <!-- right view -->
        <div :style="gridPosition(1, 0)">
          {{ views[2][rowIndex] }}
        </div>
      </div>
      <!-- placeholder -->
      <div :style="gridPosition(size + 2, 1)"></div>
      <!-- bottom view -->
      <div
        v-for="(visible, bottomIndex) in views[3]"
        :key="`bottom-${bottomIndex}`"
        :style="gridPosition(size + 2, bottomIndex + 2)"
      >
        {{ visible }}
      </div>
      <!-- placeholder -->
      <div :style="gridPosition(size + 2, size + 2)"></div>
    </div>
    <Selection
      :size="size"
      :selected="pickedTree"
      @changeSelection="pickedTree = $event"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Selection from "@/components/trees/Selection.vue";

@Component<Sudoku>({
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
export default class Sudoku extends Vue {
  @Prop({ default: false })
  private initialize: boolean;
  @Prop({ default: false })
  private evaluate: boolean;
  @Prop({ required: true })
  private args!: { size: number };

  private size: number;

  private values: number[][] = null;
  private views: number[][] = null;

  private pickedTree = 0;

  created() {
    this.size = this.args.size;
    this.initializeGame();
    this.$emit("initialized-game");
  }

  public initializeGame(): void {
    [this.values, this.views] = this.generate(
      new Array<number>(this.size)
        .fill(0)
        .map(() => new Array<number>(this.size).fill(0)),
      new Array<number>(4)
        .fill(0)
        .map(() => new Array<number>(this.size).fill(0))
    );
  }

  public evaluateGame(): boolean {
    return this.isValid(this.values, this.views, true);
  }

  private putTree(rowIndex: number, colIndex: number) {
    this.values[rowIndex][colIndex] = this.pickedTree;
    this.pickedTree = 0;
  }

  private generate(
    values: number[][],
    views: number[][]
  ): [number[][], number[][]] {
    const [emptyValueSlotRow, emptyValueSlotCol] = this.findEmptySlot(values);
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
        values[emptyValueSlotRow][emptyValueSlotCol] = numbers[i];
      } else {
        views[emptyViewSlotRow][emptyViewSlotCol] = numbers[i];
      }
      if (this.isValid(values, views, false)) {
        const solutions = this.solve(values, views, 0);
        if (solutions === 0) {
          continue;
        } else if (solutions === 1) {
          return [values, views];
        } else {
          return this.generate(values, views);
        }
      } else {
        values[emptyValueSlotRow][emptyValueSlotCol] = 0;
        views[emptyViewSlotRow][emptyViewSlotCol] = 0;
      }
    }
    return [values, views];
  }

  private solve(
    values: number[][],
    views: number[][],
    solutions: number
  ): number {
    const [emptyValueSlotRow, emptyValueSlotCol] = this.findEmptySlot(values);
    if (emptyValueSlotRow === null || emptyValueSlotCol === null) {
      return solutions + 1;
    }

    const numbers: number[] = [];
    for (let i = 0; i < this.size; i++) {
      numbers[i] = i + 1;
    }
    this.shuffle(numbers);
    for (let i = 0; i < numbers.length; i++) {
      values[emptyValueSlotRow][emptyValueSlotCol] = numbers[i];
      if (this.isValid(values, views, false)) {
        solutions = this.solve(values, views, solutions);
        if (solutions > 1) {
          break;
        }
      }
    }
    values[emptyValueSlotRow][emptyValueSlotCol] = 0;
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

  private shuffle(arr: any[]): void {
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

  private isValid(
    values: number[][],
    views: number[][],
    complete: boolean
  ): boolean {
    for (let i = 0; i < values.length; i++) {
      const rowSeen = new Set<number>();
      const colSeen = new Set<number>();
      for (let j = 0; j < values[i].length; j++) {
        const traversal: [number, Set<number>][] = [
          [values[i][j], rowSeen],
          [values[j][i], colSeen],
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
        const visible = this.getVisibleTrees(values[i]);
        const visibleRev = this.getVisibleTrees(values[i].slice().reverse());
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
          col[k] = values[k][i];
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

  private gridSize(): string {
    return `grid-template-columns: 0.5fr repeat(${this.size}, 1fr) 0.5fr; grid-auto-rows: 0.5fr repeat(${this.size}, 1fr) 0.5fr;`;
  }

  private gridRowSizeAndPosition(rowIndex: string, colIndex: string): string {
    return `grid-template-columns: 0.5fr repeat(${this.size}, 1fr) 0.5fr; grid-row: ${rowIndex}; grid-column: ${colIndex};`;
  }

  private gridPosition(rowIndex: string, colIndex: string): string {
    return `grid-row: ${rowIndex}; grid-column: ${colIndex};`;
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
.row {
  display: grid;
}
.wrapper * {
  border: 1px solid gray;
}
</style>
