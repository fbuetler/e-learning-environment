/*
https://developer.mozilla.org/de/docs/Web/Guide/HTML/Canvas_Tutorial
https://29a.ch/2010/2/10/hand-drawn-lines-algorithm-javascript-canvas-html5
https://github.com/balint42/comic.js

weird linewidths:

odd lineWidths  will never apply cleanly with drawn on integer pixel values. 
This is because X and Y refer to the space between pixels rather than their
centers. So a stroke of 1 that runs from [1,1] to [1,10] spills half into 
the pixel on the left column of pixels and half into right. If you instead 
draw that line from [1.5,1] to [1.5,10] then it fills half to the left, and 
half to the right, filling up the whole pixel column perfectly.

Any odd number width will show this behavior, but even numbers will not 
because they fill a full pixel on each side looking clean.

the box is obscured by the top of the canvas. When you center your 3px 
stroke on [0,0] it spills as far up and left as [-1.5,-1.5] which is 
outside of the visible range of the canvas. So it appears half as thick 
as it should be.
*/

import data from "@/assets/ciphertexts/ciphertexts.json";

export type SymbolConfig = [Shape, Map<string, number | string | boolean>][];

export interface CanvasInterface {
  draw(shapes: SymbolConfig): void;
}

export function LoadRandomElement(key: string): string {
  const elems: Array<string> = data[key];
  return elems[Math.floor(Math.random() * elems.length)];
}

export function LoadRandomNumber(): number {
  return Math.floor(Math.random() * 99);
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
  constructor(
    public canvas: HTMLCanvasElement,
    public width: number,
    public height: number
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
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}

class NumberCanvas extends Canvas implements CanvasInterface {
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

  private drawDot(quantity: number) {
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

  private drawRectangle() {
    const lineWidth = 5;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeRect(0, 0, this.width, this.height);
  }

  private drawTriangle() {
    const lineWidth = 3;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(this.width / 2, 0);
    this.ctx.lineTo(this.height, this.width);
    this.ctx.lineTo(0, this.height);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  private drawText(text: string) {
    this.ctx.font = "30px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(text, this.height / 2, this.width / 2);
  }
}

class LetterCanvas extends Canvas implements CanvasInterface {
  draw(shapes: SymbolConfig) {
    this.clear();
    shapes.forEach(([shape, args]) => {
      switch (shape) {
        case Shape.LETTER_NARROWRECT: {
          this.drawNarrowRectangle();
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

  private drawNarrowRectangle() {
    const lineWidth = 5;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeRect(
      lineWidth / 2,
      lineWidth / 2,
      this.width / 2 - lineWidth / 2,
      this.height - lineWidth
    );
  }

  private drawHorrizontalLines(
    lines: number,
    offsetX: number,
    colored: boolean
  ) {
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = "#000000";
    const diffY = this.height / (lines + 1);
    if (colored) {
      this.ctx.strokeStyle = "#ffa500";
    }
    for (let i = 0; i < lines; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(offsetX * this.width, (i + 1) * diffY);
      this.ctx.lineTo(offsetX * this.width + this.width / 2, (i + 1) * diffY);
      this.ctx.stroke();
    }
  }

  private drawTriangles(triangles: number, offsetX: number) {
    this.ctx.lineWidth = 5;
    this.ctx.lineJoin = "bevel";
    this.ctx.strokeStyle = "#ffa500";
    if (triangles <= 0) {
      return;
    }
    this.ctx.beginPath();
    this.ctx.moveTo(offsetX * this.width, this.height);
    this.ctx.lineTo(offsetX * this.width, 0);
    const diffY = this.height / (2 * triangles);
    for (let i = 1; i <= triangles; i++) {
      this.ctx.lineTo(this.width, (2 * i - 1) * diffY);
      this.ctx.lineTo(offsetX * this.width, 2 * i * diffY);
    }
    this.ctx.stroke();
  }

  private drawArcs(arcs: number, offsetX: number) {
    const lineWidth = 5;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = "#ffa500";
    if (arcs <= 0) {
      return;
    }
    this.ctx.beginPath();
    this.ctx.moveTo(offsetX * this.width, this.height);
    this.ctx.lineTo(offsetX * this.width, 0);
    const diffY = this.height / (2 * arcs);
    for (let i = 1; i <= arcs; i++) {
      this.ctx.arc(
        offsetX * this.width,
        (2 * i - 1) * diffY,
        diffY - lineWidth / 2,
        1.5 * Math.PI,
        0.5 * Math.PI,
        false
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
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): CanvasInterface {
  switch (type) {
    case Type.NUMBER: {
      return new NumberCanvas(canvas, width, height);
    }
    case Type.LETTER: {
      return new LetterCanvas(canvas, width, height);
    }
    default: {
      return null;
    }
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
    [[Shape.EMPTY, null]],
    [[Shape.EMPTY, null]],
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
          ["offsetX", 0.5],
        ]),
      ],
    ],
    [
      [
        Shape.LETTER_HORRIZONTALLINE,
        new Map<string, number | string | boolean>([
          ["quantity", 2],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
    [
      [
        Shape.LETTER_HORRIZONTALLINE,
        new Map<string, number | string | boolean>([
          ["quantity", 3],
          ["colored", true],
          ["offsetX", 0.5],
        ]),
      ],
    ],
    [
      [
        Shape.LETTER_TRIANGLES,
        new Map<string, number | string | boolean>([
          ["quantity", 1],
          ["offsetX", 0.5],
        ]),
      ],
    ],
    [
      [
        Shape.LETTER_TRIANGLES,
        new Map<string, number | string | boolean>([
          ["quantity", 2],
          ["offsetX", 0.5],
        ]),
      ],
    ],
    [
      [
        Shape.LETTER_TRIANGLES,
        new Map<string, number | string | boolean>([
          ["quantity", 3],
          ["offsetX", 0.5],
        ]),
      ],
    ],
    [
      [
        Shape.LETTER_ARCS,
        new Map<string, number | string | boolean>([
          ["quantity", 1],
          ["offsetX", 0.5],
        ]),
      ],
    ],
    [
      [
        Shape.LETTER_ARCS,
        new Map<string, number | string | boolean>([
          ["quantity", 2],
          ["offsetX", 0.5],
        ]),
      ],
    ],
    [
      [
        Shape.LETTER_ARCS,
        new Map<string, number | string | boolean>([
          ["quantity", 3],
          ["offsetX", 0.5],
        ]),
      ],
    ],
  ],
  [
    [
      [Shape.LETTER_NARROWRECT, null],
      [
        Shape.LETTER_HORRIZONTALLINE,
        new Map<string, number | string | boolean>([["quantity", 1]]),
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
      [Shape.LETTER_NARROWRECT, null],
      [
        Shape.LETTER_HORRIZONTALLINE,
        new Map<string, number | string | boolean>([["quantity", 2]]),
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
      [Shape.LETTER_NARROWRECT, null],
      [
        Shape.LETTER_HORRIZONTALLINE,
        new Map<string, number | string | boolean>([["quantity", 3]]),
      ],
    ],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "S"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "T"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "U"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "V"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "X"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "Y"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", "Z"]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", ""]])]],
    [[Shape.TEXT, new Map<string, number | string | boolean>([["text", ""]])]],
  ],
];

export const LetterLookup: Map<string, SymbolConfig> = new Map([
  [
    "A",
    [
      [Shape.LETTER_NARROWRECT, null],
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
      [Shape.LETTER_NARROWRECT, null],
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
      [Shape.LETTER_NARROWRECT, null],
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
      [Shape.LETTER_NARROWRECT, null],
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
      [Shape.LETTER_NARROWRECT, null],
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
      [Shape.LETTER_NARROWRECT, null],
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
      [Shape.LETTER_NARROWRECT, null],
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
      [Shape.LETTER_NARROWRECT, null],
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
      [Shape.LETTER_NARROWRECT, null],
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
      [Shape.LETTER_NARROWRECT, null],
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
      [Shape.LETTER_NARROWRECT, null],
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
      [Shape.LETTER_NARROWRECT, null],
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
    "N",
    [
      [Shape.LETTER_NARROWRECT, null],
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
      [Shape.LETTER_NARROWRECT, null],
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
      [Shape.LETTER_NARROWRECT, null],
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
      [Shape.LETTER_NARROWRECT, null],
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
      [Shape.LETTER_NARROWRECT, null],
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
      [Shape.LETTER_NARROWRECT, null],
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
      [Shape.LETTER_NARROWRECT, null],
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
      [Shape.LETTER_NARROWRECT, null],
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
      [Shape.LETTER_NARROWRECT, null],
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
      [Shape.LETTER_NARROWRECT, null],
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
      [Shape.LETTER_NARROWRECT, null],
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
      [Shape.LETTER_NARROWRECT, null],
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
      [Shape.LETTER_NARROWRECT, null],
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
