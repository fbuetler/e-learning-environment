/*
https://developer.mozilla.org/de/docs/Web/Guide/HTML/Canvas_Tutorial
https://29a.ch/2010/2/10/hand-drawn-lines-algorithm-javascript-canvas-html5
https://github.com/balint42/comic.js
*/

import data from "@/assets/ciphertexts/ciphertexts.json";

export type SymbolConfig = [Shape, Map<string, number | string | boolean>][];

export interface SymbolCanvasInterface {
  draw(shapes: SymbolConfig): void;
}

export interface PatternCanvasInterface {
  draw(cells: number, connectAndFill: [number, number][]): void;
}

export function LoadRandomElement(key: string): string {
  const elems: Array<string> = data[key];
  return elems[Math.floor(Math.random() * elems.length)];
}

export function LoadRandomNumber(): number {
  return Math.floor(Math.random() * 99);
}

export function CreatePattern(
  text: string[],
  swapAmount: number
): Array<[number, number]> {
  const pattern = new Array<[number, number]>();
  const letters = [...Array(text.length).keys()];
  for (let j = 1; j <= swapAmount && 2 * j <= text.length; j++) {
    const leftIndex = Math.floor(Math.random() * letters.length);
    const left = letters[leftIndex];
    letters.splice(leftIndex, 1);
    const rightIndex = Math.floor(Math.random() * letters.length);
    const right = letters[rightIndex];
    letters.splice(rightIndex, 1);
    pattern.push([Math.min(left, right), Math.max(left, right)]);
  }
  return pattern;
}

export function Swap(str: string[], pattern: [number, number][]): string[] {
  pattern.forEach(([left, right]) => {
    const tmp = str[left];
    str[left] = str[right];
    str[right] = tmp;
  });
  return str;
}

export enum Type {
  NUMBER,
  LETTER,
}

export enum Shape {
  EMPTY,
  TEXT,
  NUMBER_CIRCLE,
  NUMBER_TRIANGLE,
  NUMBER_RECTANGLE,
  NUMBER_DOT,
  LETTER_NARROWRECT,
  LETTER_HORRIZONTALLINE,
  LETTER_TRIANGLES,
  LETTER_ARCS,
}

abstract class Canvas {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  lineWidth: number;
  colors = [
    "darkblue",
    "darkgreen",
    "darkorange",
    "firebrick",
    "maroon",
    "violet",
    "saddlebrown",
    "mintcream",
  ];
  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d");

    this.width = canvas.width;
    this.height = canvas.height;

    this.lineWidth = 6;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.strokeStyle = "#000000";
    this.ctx.lineCap = "butt";
    this.ctx.lineJoin = "miter";
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}

class NumberCanvas extends Canvas implements SymbolCanvasInterface {
  draw(shapes: SymbolConfig) {
    this.clear();
    shapes.forEach(([shape, args]) => {
      switch (shape) {
        case Shape.NUMBER_CIRCLE: {
          this.drawCircle();
          break;
        }
        case Shape.NUMBER_RECTANGLE: {
          this.drawRectangle();
          break;
        }
        case Shape.NUMBER_TRIANGLE: {
          this.drawTriangle();
          break;
        }
        case Shape.NUMBER_DOT: {
          this.drawDot(args.get("quantity") as number);
          break;
        }
        case Shape.TEXT: {
          this.drawText(args.get("text") as string);
          break;
        }
        case Shape.EMPTY: {
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  private drawCircle() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    this.ctx.beginPath();
    this.ctx.arc(
      centerX,
      centerY,
      Math.min(this.width, this.height) / 2 - this.lineWidth,
      0,
      2 * Math.PI,
      false
    );
    this.ctx.stroke();
  }

  private drawDot(quantity: number) {
    const centers = new Array<[number, number]>();
    if (quantity < 4) {
      const centerX = this.width / 2;
      let centerY = 0;
      const offsetY = this.height / (quantity + 1);
      for (let i = 0; i < quantity; i++) {
        centerY += offsetY;
        centers.push([centerX, centerY]);
      }
    } else {
      let centerX = 0;
      let centerY = 0;
      const dotsPerRow = Math.ceil(quantity / 2);
      const rows = Math.ceil(quantity / dotsPerRow);
      let offsetX = this.width / (dotsPerRow + 1);
      const offsetY = this.height / (rows + 1);
      let drawnDots = 0;
      for (let i = 0; i < rows; i++) {
        centerX = 0;
        centerY += offsetY;
        if (quantity - drawnDots < dotsPerRow) {
          offsetX = this.width / (quantity - drawnDots + 1);
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
  }

  private drawRectangle() {
    this.ctx.strokeRect(
      this.lineWidth / 2,
      this.lineWidth / 2,
      this.width - this.lineWidth,
      this.height - this.lineWidth
    );
  }

  private drawTriangle() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.width / 2, 0);
    this.ctx.lineTo(this.width, this.height - this.lineWidth / 2);
    this.ctx.lineTo(0, this.height - this.lineWidth / 2);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  private drawText(text: string) {
    this.ctx.font = "30px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(text, this.height / 2, this.width / 2);
  }
}

class LetterCanvas extends Canvas implements SymbolCanvasInterface {
  draw(shapes: SymbolConfig) {
    this.clear();
    shapes.forEach(([shape, args]) => {
      switch (shape) {
        case Shape.LETTER_NARROWRECT: {
          this.drawNarrowRectangle((args.get("offsetX") as number) || 0);
          break;
        }
        case Shape.LETTER_HORRIZONTALLINE: {
          this.drawHorrizontalLines(
            (args.get("quantity") as number) || 0,
            (args.get("offsetX") as number) || 0,
            (args.get("colored") as boolean) || false
          );
          break;
        }
        case Shape.LETTER_TRIANGLES: {
          this.drawTriangles(
            (args.get("quantity") as number) || 0,
            (args.get("offsetX") as number) || 0
          );
          break;
        }
        case Shape.LETTER_ARCS: {
          this.drawArcs(
            (args.get("quantity") as number) || 0,
            (args.get("offsetX") as number) || 0
          );
          break;
        }
        case Shape.TEXT: {
          this.drawText(args.get("text") as string);
          break;
        }
        case Shape.EMPTY: {
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  private drawNarrowRectangle(offsetX: number) {
    let startX: number;
    if (offsetX === 0) {
      startX = this.lineWidth / 2;
    } else {
      startX = offsetX * this.width;
    }
    this.ctx.strokeRect(
      startX,
      this.lineWidth / 2,
      this.width / 2 - this.lineWidth / 2,
      this.height - this.lineWidth
    );
  }

  private drawHorrizontalLines(
    lines: number,
    offsetX: number,
    colored: boolean
  ) {
    this.ctx.lineCap = "square";
    if (colored) {
      this.ctx.strokeStyle = "#ffa500";
    }
    const diffY = this.height / (lines + 1);
    for (let i = 0; i < lines; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(offsetX * this.width + this.lineWidth, (i + 1) * diffY);
      this.ctx.lineTo(
        offsetX * this.width + this.width / 2 - this.lineWidth / 2,
        (i + 1) * diffY
      );
      this.ctx.stroke();
    }
  }

  private drawTriangles(triangles: number, offsetX: number) {
    this.ctx.lineJoin = "bevel";
    this.ctx.strokeStyle = "#ffa500";
    if (triangles <= 0) {
      return;
    }
    this.ctx.beginPath();
    this.ctx.moveTo(offsetX * this.width + this.lineWidth, this.height);
    this.ctx.lineTo(offsetX * this.width + this.lineWidth, 0);
    const diffY = this.height / (2 * triangles);
    for (let i = 1; i <= triangles; i++) {
      this.ctx.lineTo(
        offsetX * this.width + this.width / 2,
        (2 * i - 1) * diffY
      );
      this.ctx.lineTo(offsetX * this.width + this.lineWidth, 2 * i * diffY);
    }
    this.ctx.stroke();
  }

  private drawArcs(arcs: number, offsetX: number) {
    this.ctx.strokeStyle = "#ffa500";
    if (arcs <= 0) {
      return;
    }
    this.ctx.lineJoin = "bevel";
    this.ctx.beginPath();
    this.ctx.moveTo(offsetX * this.width + this.lineWidth, this.height);
    this.ctx.lineTo(offsetX * this.width + this.lineWidth, 0);
    const diffY = this.height / (2 * arcs);
    for (let i = 1; i <= arcs; i++) {
      this.ctx.quadraticCurveTo(
        this.width - this.lineWidth / 2,
        (2 * i - 1) * diffY,
        offsetX * this.width + this.lineWidth,
        2 * i * diffY
      );
    }
    this.ctx.stroke();
  }

  private drawText(text: string) {
    this.ctx.font = "30px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(text, this.height / 2, this.width / 2);
  }
}

export function GetNewCanvas(
  type: Type,
  canvas: HTMLCanvasElement
): SymbolCanvasInterface {
  switch (type) {
    case Type.NUMBER: {
      return new NumberCanvas(canvas);
    }
    case Type.LETTER: {
      return new LetterCanvas(canvas);
    }
    default: {
      return null;
    }
  }
}

export class PatternCanvas extends Canvas implements PatternCanvasInterface {
  draw(cells: number, connectAndFill: [number, number][]) {
    this.clear();
    this.drawPattern(cells, connectAndFill);
  }

  drawPattern(cells: number, connectAndFill: [number, number][]) {
    const rectX = this.lineWidth / 2;
    const rectY = this.lineWidth / 2;
    const rectWidth = this.width - this.lineWidth;
    const rectHeight = this.height / 2 - this.lineWidth;

    // draw box
    this.ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
    const cellWidth = rectWidth / cells;
    // draw walls
    for (let i = 1; i < cells; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(rectX + cellWidth * i, rectY);
      this.ctx.lineTo(rectX + cellWidth * i, rectY + rectHeight);
      this.ctx.stroke();
    }

    // sort to have it easier to draw the lines connecting the boxes on the right height
    connectAndFill.sort(([a, b], [c, d]) => Math.abs(a - b) - Math.abs(c - d));
    const arrowLevelY = this.calculateArrowLevelY(connectAndFill);
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
        this.ctx.fillStyle = this.colors[i % this.colors.length];
        this.ctx.beginPath();
        this.ctx.moveTo(
          rectX + cellWidth * box + this.lineWidth / 2,
          rectY + this.lineWidth / 2
        );
        this.ctx.lineTo(
          rectX + cellWidth * box + this.lineWidth / 2,
          rectY + rectHeight - this.lineWidth / 2
        );
        this.ctx.lineTo(
          rectX + cellWidth * (box + 1) - this.lineWidth / 2,
          rectY + rectHeight - this.lineWidth / 2
        );
        this.ctx.lineTo(
          rectX + cellWidth * (box + 1) - this.lineWidth / 2,
          rectY + this.lineWidth / 2
        );
        this.ctx.lineTo(
          rectX + cellWidth * box + this.lineWidth / 2,
          rectY + this.lineWidth / 2
        );
        this.ctx.fill();

        // draw arrow heads
        this.ctx.fillStyle = "black";
        this.drawArrowHead(
          centerX,
          rectY + rectHeight + 5,
          Math.min(30, cellWidth),
          10
        );
      }

      const lineY =
        rectHeight +
        20 +
        arrowLevelY.get(JSON.stringify(connectAndFill[i])) *
          ((rectHeight + rectY + 20) / cells);
      // connect arrows
      this.ctx.beginPath();
      this.ctx.moveTo(
        rectX + cellWidth * left + cellWidth / 2,
        rectY + rectHeight + 15
      );
      this.ctx.bezierCurveTo(
        rectX + cellWidth * left + cellWidth / 2,
        lineY,
        rectX + cellWidth * right + cellWidth / 2,
        lineY,
        rectX + cellWidth * right + cellWidth / 2,
        rectY + rectHeight + 15
      );
      this.ctx.lineWidth = this.lineWidth / 2;
      this.ctx.stroke();
      this.ctx.lineWidth = this.lineWidth;
    }
  }

  drawArrowHead(
    headX: number,
    headY: number,
    headWidth: number,
    headHeight: number
  ) {
    this.ctx.beginPath();
    this.ctx.moveTo(headX, headY);
    this.ctx.lineTo(headX - headWidth / 2, headY + headHeight);
    this.ctx.lineTo(headX + headWidth / 2, headY + headHeight);
    this.ctx.lineTo(headX, headY);
    this.ctx.fill();
  }

  calculateArrowLevelY(
    connectAndFill: [number, number][]
  ): Map<string, number> {
    const level = new Map<string, number>();
    connectAndFill.forEach((el) => level.set(JSON.stringify(el), 1));
    for (let i = 0; i < connectAndFill.length; i++) {
      const [a, b] = connectAndFill[i];
      for (let j = i + 1; j < connectAndFill.length; j++) {
        const [c, d] = connectAndFill[j];
        if (c < a && b < d) {
          level.set(
            JSON.stringify(connectAndFill[j]),
            level.get(JSON.stringify(connectAndFill[i])) + 1
          );
        }
      }
    }
    return level;
  }
}

export const NumberTable: SymbolConfig[][] = [
  [
    [[Shape.EMPTY, null]],
    [[Shape.NUMBER_DOT, new Map([["quantity", 1]])]],
    [[Shape.NUMBER_DOT, new Map([["quantity", 2]])]],
    [[Shape.NUMBER_DOT, new Map([["quantity", 3]])]],
    [[Shape.NUMBER_DOT, new Map([["quantity", 4]])]],
  ],
  [
    [[Shape.NUMBER_RECTANGLE, null]],
    [[Shape.TEXT, new Map([["text", 0]])]],
    [[Shape.TEXT, new Map([["text", 1]])]],
    [[Shape.TEXT, new Map([["text", 2]])]],
    [[Shape.TEXT, new Map([["text", 3]])]],
  ],
  [
    [[Shape.NUMBER_CIRCLE, null]],
    [[Shape.TEXT, new Map([["text", 4]])]],
    [[Shape.TEXT, new Map([["text", 5]])]],
    [[Shape.TEXT, new Map([["text", 6]])]],
    [[Shape.TEXT, new Map([["text", 7]])]],
  ],
  [
    [[Shape.NUMBER_TRIANGLE, null]],
    [[Shape.TEXT, new Map([["text", 8]])]],
    [[Shape.TEXT, new Map([["text", 9]])]],
  ],
];

export const NumberLookup: Map<string, SymbolConfig> = new Map([
  [
    "0",
    [
      [Shape.NUMBER_RECTANGLE, null],
      [Shape.NUMBER_DOT, new Map([["quantity", 1]])],
    ],
  ],
  [
    "1",
    [
      [Shape.NUMBER_RECTANGLE, null],
      [Shape.NUMBER_DOT, new Map([["quantity", 2]])],
    ],
  ],
  [
    "2",
    [
      [Shape.NUMBER_RECTANGLE, null],
      [Shape.NUMBER_DOT, new Map([["quantity", 3]])],
    ],
  ],
  [
    "3",
    [
      [Shape.NUMBER_RECTANGLE, null],
      [Shape.NUMBER_DOT, new Map([["quantity", 4]])],
    ],
  ],
  [
    "4",
    [
      [Shape.NUMBER_CIRCLE, null],
      [Shape.NUMBER_DOT, new Map([["quantity", 1]])],
    ],
  ],
  [
    "5",
    [
      [Shape.NUMBER_CIRCLE, null],
      [Shape.NUMBER_DOT, new Map([["quantity", 2]])],
    ],
  ],
  [
    "6",
    [
      [Shape.NUMBER_CIRCLE, null],
      [Shape.NUMBER_DOT, new Map([["quantity", 3]])],
    ],
  ],
  [
    "7",
    [
      [Shape.NUMBER_CIRCLE, null],
      [Shape.NUMBER_DOT, new Map([["quantity", 4]])],
    ],
  ],
  [
    "8",
    [
      [Shape.NUMBER_TRIANGLE, null],
      [Shape.NUMBER_DOT, new Map([["quantity", 1]])],
    ],
  ],
  [
    "9",
    [
      [Shape.NUMBER_TRIANGLE, null],
      [Shape.NUMBER_DOT, new Map([["quantity", 2]])],
    ],
  ],
]);

export const LetterTable: SymbolConfig[][] = [
  [
    [[Shape.EMPTY, null]],
    [
      [
        Shape.LETTER_HORRIZONTALLINE,
        new Map<string, number | string | boolean>([
          ["quantity", 1],
          ["colored", true],
          ["offsetX", 0.25],
        ]),
      ],
    ],
    [
      [
        Shape.LETTER_HORRIZONTALLINE,
        new Map<string, number | string | boolean>([
          ["quantity", 2],
          ["colored", true],
          ["offsetX", 0.25],
        ]),
      ],
    ],
    [
      [
        Shape.LETTER_HORRIZONTALLINE,
        new Map<string, number | string | boolean>([
          ["quantity", 3],
          ["colored", true],
          ["offsetX", 0.25],
        ]),
      ],
    ],
    [
      [
        Shape.LETTER_TRIANGLES,
        new Map<string, number | string | boolean>([
          ["quantity", 1],
          ["offsetX", 0.25],
        ]),
      ],
    ],
    [
      [
        Shape.LETTER_TRIANGLES,
        new Map<string, number | string | boolean>([
          ["quantity", 2],
          ["offsetX", 0.25],
        ]),
      ],
    ],
    [
      [
        Shape.LETTER_TRIANGLES,
        new Map<string, number | string | boolean>([
          ["quantity", 3],
          ["offsetX", 0.25],
        ]),
      ],
    ],
    [
      [
        Shape.LETTER_ARCS,
        new Map<string, number | string | boolean>([
          ["quantity", 1],
          ["offsetX", 0.25],
        ]),
      ],
    ],
    [
      [
        Shape.LETTER_ARCS,
        new Map<string, number | string | boolean>([
          ["quantity", 2],
          ["offsetX", 0.25],
        ]),
      ],
    ],
    [
      [
        Shape.LETTER_ARCS,
        new Map<string, number | string | boolean>([
          ["quantity", 3],
          ["offsetX", 0.25],
        ]),
      ],
    ],
  ],
  [
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.25]]),
      ],
      [
        Shape.LETTER_HORRIZONTALLINE,
        new Map<string, number | string | boolean>([
          ["quantity", 1],
          ["offsetX", 0.25],
        ]),
      ],
    ],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "A"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "B"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "C"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "D"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "E"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "F"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "G"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "H"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "I"]])]],
  ],
  [
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.25]]),
      ],
      [
        Shape.LETTER_HORRIZONTALLINE,
        new Map<string, number | string | boolean>([
          ["quantity", 2],
          ["offsetX", 0.25],
        ]),
      ],
    ],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "J"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "K"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "L"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "M"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "N"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "O"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "P"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "Q"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "R"]])]],
  ],
  [
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.25]]),
      ],
      [
        Shape.LETTER_HORRIZONTALLINE,
        new Map<string, number | string | boolean>([
          ["quantity", 3],
          ["offsetX", 0.25],
        ]),
      ],
    ],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "S"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "T"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "U"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "V"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "W"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "X"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "Y"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "Z"]])]],
  ],
];

export const LetterLookup: Map<string, SymbolConfig> = new Map([
  [
    "A",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 1]])],
      [
        Shape.LETTER_HORRIZONTALLINE,
        new Map<string, number | string | boolean>([
          ["quantity", 1],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    "B",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 1]])],
      [
        Shape.LETTER_HORRIZONTALLINE,
        new Map<string, number | string | boolean>([
          ["quantity", 2],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    "C",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 1]])],
      [
        Shape.LETTER_HORRIZONTALLINE,
        new Map<string, number | string | boolean>([
          ["quantity", 3],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    "D",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 1]])],
      [
        Shape.LETTER_TRIANGLES,
        new Map<string, number | string | boolean>([
          ["quantity", 1],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    "E",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 1]])],
      [
        Shape.LETTER_TRIANGLES,
        new Map<string, number | string | boolean>([
          ["quantity", 2],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    "F",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 1]])],
      [
        Shape.LETTER_TRIANGLES,
        new Map<string, number | string | boolean>([
          ["quantity", 3],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    "G",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 1]])],
      [
        Shape.LETTER_ARCS,
        new Map<string, number | string | boolean>([
          ["quantity", 1],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    "H",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 1]])],
      [
        Shape.LETTER_ARCS,
        new Map<string, number | string | boolean>([
          ["quantity", 2],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    "I",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 1]])],
      [
        Shape.LETTER_ARCS,
        new Map<string, number | string | boolean>([
          ["quantity", 3],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    "J",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 2]])],
      [
        Shape.LETTER_HORRIZONTALLINE,
        new Map<string, number | string | boolean>([
          ["quantity", 1],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    "K",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 2]])],
      [
        Shape.LETTER_HORRIZONTALLINE,
        new Map<string, number | string | boolean>([
          ["quantity", 2],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    "L",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 2]])],
      [
        Shape.LETTER_HORRIZONTALLINE,
        new Map<string, number | string | boolean>([
          ["quantity", 3],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    "M",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 2]])],
      [
        Shape.LETTER_TRIANGLES,
        new Map<string, number | string | boolean>([
          ["quantity", 1],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    "N",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 2]])],
      [
        Shape.LETTER_TRIANGLES,
        new Map<string, number | string | boolean>([
          ["quantity", 2],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    "O",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 2]])],
      [
        Shape.LETTER_TRIANGLES,
        new Map<string, number | string | boolean>([
          ["quantity", 3],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    "P",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 2]])],
      [
        Shape.LETTER_ARCS,
        new Map<string, number | string | boolean>([
          ["quantity", 1],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    "Q",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 2]])],
      [
        Shape.LETTER_ARCS,
        new Map<string, number | string | boolean>([
          ["quantity", 2],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    "R",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 2]])],
      [
        Shape.LETTER_ARCS,
        new Map<string, number | string | boolean>([
          ["quantity", 3],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    "S",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 3]])],
      [
        Shape.LETTER_HORRIZONTALLINE,
        new Map<string, number | string | boolean>([
          ["quantity", 1],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    "T",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 3]])],
      [
        Shape.LETTER_HORRIZONTALLINE,
        new Map<string, number | string | boolean>([
          ["quantity", 2],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    "U",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 3]])],
      [
        Shape.LETTER_HORRIZONTALLINE,
        new Map<string, number | string | boolean>([
          ["quantity", 3],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    "V",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 3]])],
      [
        Shape.LETTER_TRIANGLES,
        new Map<string, number | string | boolean>([
          ["quantity", 1],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    "W",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 3]])],
      [
        Shape.LETTER_TRIANGLES,
        new Map<string, number | string | boolean>([
          ["quantity", 2],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    "X",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 3]])],
      [
        Shape.LETTER_TRIANGLES,
        new Map<string, number | string | boolean>([
          ["quantity", 3],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    "Y",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 3]])],
      [
        Shape.LETTER_ARCS,
        new Map<string, number | string | boolean>([
          ["quantity", 1],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    "Z",
    [
      [
        Shape.LETTER_NARROWRECT,
        new Map<string, number | string | boolean>([["offsetX", 0.0]]),
      ],
      [Shape.LETTER_HORRIZONTALLINE, new Map([["quantity", 3]])],
      [
        Shape.LETTER_ARCS,
        new Map<string, number | string | boolean>([
          ["quantity", 2],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
]);
