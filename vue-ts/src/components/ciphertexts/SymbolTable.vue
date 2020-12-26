<template>
  <div class="card">
    <table>
      <tbody>
        <tr v-for="(row, rowIndex) in table" :key="rowIndex">
          <td
            v-for="(shape, shapeIndex) in row"
            :key="shapeIndex"
            :class="{ selected: isSelected(rowIndex, shapeIndex) }"
            @click="selectSymbol(rowIndex, shapeIndex)"
          >
            <canvas
              :id="'shape-' + rowIndex + '-' + shapeIndex"
              width="100"
              height="100"
              >Shape</canvas
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { GetNewCanvas, SymbolConfig, Shape, Type } from "./Ciphertext";

@Component<SymbolTable>({})
export default class SymbolTable extends Vue {
  @Prop({ required: true })
  table: SymbolConfig[][];
  @Prop({ required: true })
  type: Type;
  @Prop()
  selected: [string, number, number];

  mounted() {
    this.drawShapes();
  }

  updated() {
    this.drawShapes();
  }

  drawShapes() {
    this.table.forEach((row, rowIndex) => {
      row.forEach((shapes, shapeIndex) => {
        const cvShape = GetNewCanvas(
          this.type,
          document.getElementById(
            `shape-${rowIndex}-${shapeIndex}`
          ) as HTMLCanvasElement
        );
        cvShape.draw(shapes);
      });
    });
  }

  isSelected(rowIndex: number, shapeIndex: number): boolean {
    return (
      JSON.stringify([
        this.getSymboltext(rowIndex, shapeIndex),
        rowIndex,
        shapeIndex,
      ]) == JSON.stringify(this.selected)
    );
  }

  selectSymbol(rowIndex: number, shapeIndex: number) {
    if (rowIndex === 0 || shapeIndex === 0) {
      return;
    }
    this.$emit(
      "symbol-selected",
      this.getSymboltext(rowIndex, shapeIndex),
      rowIndex,
      shapeIndex
    );
  }

  getSymboltext(rowIndex: number, shapeIndex: number): string {
    const symbol = this.table[rowIndex][shapeIndex].find(
      (shape) => shape[0] === Shape.TEXT
    );
    return symbol !== undefined ? (symbol[1].get("text") as string) : "";
  }
}
</script>

<style scoped>
table {
  width: 100%;
  border-spacing: 0;
}
td {
  border-right: 4px solid black;
  border-bottom: 4px solid black;
}
.selected {
  border-top: none;
  border-left: none;
  border-right: 4px solid black;
  border-bottom: 4px solid black;
}
</style>
