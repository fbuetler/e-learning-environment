<template>
  <div id="symbol-table" class="card">
    <table>
      <tbody>
        <tr v-for="(row, rowIndex) in table" :key="rowIndex">
          <td
            v-for="(shape, shapeIndex) in row"
            :id="`field-${rowIndex}-${shapeIndex}`"
            :key="shapeIndex"
            :class="{ selected: isSelected(rowIndex, shapeIndex) }"
            @click="selectSymbol(rowIndex, shapeIndex)"
            draggable
            @dragstart="selectSymbol(rowIndex, shapeIndex)"
            @dragover.prevent
            @dragend.prevent
            @drop.prevent
          >
            <canvas
              :id="`shape-${rowIndex}-${shapeIndex}`"
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
import {
  GetNewCanvas,
  SymbolConfig,
  Type,
} from "@/components/ciphertexts/Ciphertext";

@Component<SymbolTable>({})
export default class SymbolTable extends Vue {
  @Prop({ required: true })
  table: SymbolConfig[][];
  @Prop({ required: true })
  type: Type;
  @Prop()
  selected: [number, number];

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
      JSON.stringify([rowIndex, shapeIndex]) == JSON.stringify(this.selected)
    );
  }

  selectSymbol(rowIndex: number, shapeIndex: number) {
    if (rowIndex === 0 || shapeIndex === 0) {
      return;
    }
    this.$emit("symbol-selected", rowIndex, shapeIndex);
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
