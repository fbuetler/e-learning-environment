// https://developer.mozilla.org/de/docs/Web/Guide/HTML/Canvas_Tutorial

import data from "@/assets/ciphertexts/ciphertexts.json";

export function LoadRandomElement(key: string): string {
  const elems = data[key];
  return elems[Math.floor(Math.random() * elems.length)];
}

export enum Shape {
  CIRCLE,
  TRIANGLE,
  RECTANGLE,
  DOT,
  TEXT,
  EMPTY,
}

export class Canvas {
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

    // maybe I dont need that?
    this.canvas.width = width;
    this.canvas.height = height;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw(shapes: [Shape, number][]) {
    this.clear();
    shapes.forEach(([shape, quantity]) => {
      switch (shape) {
        case Shape.CIRCLE: {
          this.drawCircle();
          break;
        }
        case Shape.RECTANGLE: {
          this.drawRectangle();
          break;
        }
        case Shape.TRIANGLE: {
          this.drawTriangle();
          break;
        }
        case Shape.DOT: {
          this.drawDot(quantity);
          break;
        }
        case Shape.TEXT: {
          this.drawText(quantity);
          break;
        }
        case Shape.EMPTY: {
          break;
        }
      }
    });
  }

  drawCircle() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    const lineWidth = 3;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.arc(
      centerX,
      centerY,
      Math.min(this.width, this.height) / 2 - lineWidth,
      0,
      2 * Math.PI,
      false
    );
    this.ctx.stroke();
  }

  drawDot(quantity: number) {
    const centers = new Array<[number, number]>();
    if (quantity < 4) {
      const centerX = this.canvas.width / 2;
      let centerY = 0;
      const offsetY = this.canvas.height / (quantity + 1);
      for (let i = 0; i < quantity; i++) {
        centerY += offsetY;
        centers.push([centerX, centerY]);
      }
    } else {
      let centerX = 0;
      let centerY = 0;
      const dotsPerRow = Math.ceil(quantity / 2);
      const rows = Math.ceil(quantity / dotsPerRow);
      let offsetX = this.canvas.width / (dotsPerRow + 1);
      const offsetY = this.canvas.height / (rows + 1);
      let drawnDots = 0;
      for (let i = 0; i < rows; i++) {
        centerX = 0;
        centerY += offsetY;
        if (quantity - drawnDots < dotsPerRow) {
          offsetX = this.canvas.width / (quantity - drawnDots + 1);
        }
        for (let j = 0; j < dotsPerRow; j++) {
          if (drawnDots < quantity) {
            drawnDots++;
            centerX += offsetX;
            centers.push([centerX, centerY]);
          }
        }
      }
    }
    this.ctx.fillStyle = "#ffa500";
    for (const [centerX, centerY] of centers) {
      this.ctx.beginPath();
      this.ctx.arc(
        centerX,
        centerY,
        Math.min(this.width, this.height) / 20,
        0,
        2 * Math.PI,
        false
      );
      this.ctx.fill();
    }
    this.ctx.strokeStyle = "#000000";
  }

  drawRectangle() {
    const lineWidth = 5;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeRect(0, 0, this.width, this.height);
  }

  drawTriangle() {
    const lineWidth = 3;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(this.width / 2, 0);
    this.ctx.lineTo(this.height, this.width);
    this.ctx.lineTo(0, this.height);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  drawText(quantity: number) {
    this.ctx.font = "30px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(String(quantity), this.height / 2, this.width / 2);
  }
}
