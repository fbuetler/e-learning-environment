<template>
  <div>
    <table>
      <tbody>
        <tr v-for="(row, rowIndex) in table" :key="rowIndex">
          <td v-for="(shape, shapeIndex) in row" :key="shapeIndex">
            <canvas :id="'shape-' + rowIndex + '-' + shapeIndex">Shape</canvas>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { GetNewCanvas, Shape, Type } from "./Ciphertext";

@Component<SymbolTable>({})
export default class SymbolTable extends Vue {
  @Prop({ required: true })
  table: [Shape, Map<string, number | string | boolean>][][][];
  @Prop({ required: true })
  type: Type;

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
          ) as HTMLCanvasElement,
          100,
          100
        );
        cvShape.draw(shapes);
      });
    });
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
</style>
