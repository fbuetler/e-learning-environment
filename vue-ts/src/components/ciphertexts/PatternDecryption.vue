<template>
  <div>
    <canvas id="test-canvas" width="500" height="150">test</canvas>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component<PatternDecryption>({})
export default class PatternDecryption extends Vue {
  mounted() {
    this.draw();
  }

  updated() {
    this.draw();
  }

  draw() {
    const canvas = document.getElementById(`test-canvas`) as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const lineWidth = 6;

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = "#000000";
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";

    ctx.clearRect(0, 0, width, height);
    this.drawCells(ctx, width, height / 2, lineWidth, 15, [
      [0, 14],
      [1, 7],
      [3, 5],
      [2, 6],
      [4, 13],
      [8, 12],
      [9, 11],
    ]);
  }

  drawCells(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    lineWidth: number,
    cells: number,
    connectAndFill: [number, number][]
  ) {
    const rectX = lineWidth / 2;
    const rectY = lineWidth / 2;
    const rectWidth = width - lineWidth;
    const rectHeight = height - lineWidth;
    const colors = [
      "darkblue",
      "darkgreen",
      "darkorange",
      "firebrick",
      "maroon",
      "violet",
      "saddlebrown",
      "mintcream",
    ];

    // draw box
    ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
    const cellWidth = rectWidth / cells;
    // draw walls
    for (let i = 1; i < cells; i++) {
      ctx.beginPath();
      ctx.moveTo(rectX + cellWidth * i, rectY);
      ctx.lineTo(rectX + cellWidth * i, rectY + rectHeight);
      ctx.stroke();
    }

    const colorDistance = 255 / Math.floor(cells / 2);
    // sort to have it easier to draw the lines connecting the boxes on the right height
    connectAndFill.sort(([a, b], [c, d]) => Math.abs(a - b) - Math.abs(c - d));
    for (let i = 0; i < connectAndFill.length; i++) {
      const [left, right] = connectAndFill[i];
      if (
        Math.min(left, right) < 0 ||
        Math.max(left, right) >= cells ||
        left === right
      ) {
        continue;
      }
      for (let j = 0; j < 2; j++) {
        const box = connectAndFill[i][j];
        const centerX = rectX + cellWidth * box + cellWidth / 2;

        // highlight boxes
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.moveTo(
          rectX + cellWidth * box + lineWidth / 2,
          rectY + lineWidth / 2
        );
        ctx.lineTo(
          rectX + cellWidth * box + lineWidth / 2,
          rectY + rectHeight - lineWidth / 2
        );
        ctx.lineTo(
          rectX + cellWidth * (box + 1) - lineWidth / 2,
          rectY + rectHeight - lineWidth / 2
        );
        ctx.lineTo(
          rectX + cellWidth * (box + 1) - lineWidth / 2,
          rectY + lineWidth / 2
        );
        ctx.lineTo(
          rectX + cellWidth * box + lineWidth / 2,
          rectY + lineWidth / 2
        );
        ctx.fill();

        // draw arrow heads
        ctx.fillStyle = "black";
        this.drawArrowHead(
          ctx,
          centerX,
          rectY + rectHeight + 5,
          Math.min(30, cellWidth),
          10
        );
      }

      const lineY =
        rectHeight + 20 + (i + 1) * ((rectHeight + rectY + 20) / cells);

      // connect arrows
      ctx.beginPath();
      ctx.moveTo(
        rectX + cellWidth * left + cellWidth / 2,
        rectY + rectHeight + 15
      );
      ctx.bezierCurveTo(
        rectX + cellWidth * left + cellWidth / 2,
        lineY,
        rectX + cellWidth * right + cellWidth / 2,
        lineY,
        rectX + cellWidth * right + cellWidth / 2,
        rectY + rectHeight + 15
      );
      ctx.lineWidth = lineWidth / 2;
      ctx.stroke();
      ctx.lineWidth = lineWidth;
    }
  }

  drawArrowHead(
    ctx: CanvasRenderingContext2D,
    headX: number,
    headY: number,
    headWidth: number,
    headHeight: number
  ) {
    ctx.beginPath();
    ctx.moveTo(headX, headY);
    ctx.lineTo(headX - headWidth / 2, headY + headHeight);
    ctx.lineTo(headX + headWidth / 2, headY + headHeight);
    ctx.lineTo(headX, headY);
    ctx.fill();
  }
}
</script>

<style scoped></style>
