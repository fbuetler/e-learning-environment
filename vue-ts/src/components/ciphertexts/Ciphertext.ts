// https://developer.mozilla.org/de/docs/Web/Guide/HTML/Canvas_Tutorial

import data from "@/assets/ciphertexts/ciphertexts.json";

export function LoadRandomElement(key: string): string {
  const elems = data[key];
  return elems[Math.floor(Math.random() * elems.length)];
}

export class Symbol {
  private ctx: CanvasRenderingContext2D;
  constructor(
    private canvas: HTMLCanvasElement,
    private width: number,
    private height: number
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = width;
    this.height = height;

    // someth doesnt work here
    this.ctx.lineWidth = 3;
    // maybe I dont need that?
    this.canvas.width = width;
    this.canvas.height = height;
  }

  clear() {
    console.log("clearing");
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawDot(radius: number, clear: boolean) {
    if (clear) {
      this.clear();
    }
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    this.ctx.stroke();
  }

  drawRectangle(clear: boolean) {
    if (clear) {
      this.clear();
    }
    this.ctx.strokeRect(0, 0, this.width, this.height);
  }

  drawTriangle(clear: boolean) {
    if (clear) {
      this.clear();
    }

    this.ctx.beginPath();
    this.ctx.moveTo(this.width / 2, 0);
    this.ctx.lineTo(this.height, this.width);
    this.ctx.lineTo(0, this.height);
    this.ctx.closePath();
    this.ctx.stroke();
  }
}
