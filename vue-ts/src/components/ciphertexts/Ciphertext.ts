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

export function LoadRandomElement(key: string): string {
  const elems = data[key];
  return elems[Math.floor(Math.random() * elems.length)];
}

export function LoadRandomNumber(): number {
  return Math.floor(Math.random() * 99);
}

export enum NumberShape {
  CIRCLE,
  TRIANGLE,
  RECTANGLE,
  DOT,
  TEXT,
  EMPTY,
}

export enum LetterShape {
  NARROWRECT,
  HORRIZONTALLINE,
  TRIANGLES,
  ARCS,
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
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  drawNumberShape(shapes: [NumberShape, number][]) {
    this.clear();
    shapes.forEach(([shape, quantity]) => {
      switch (shape) {
        case NumberShape.CIRCLE: {
          this.drawCircle();
          break;
        }
        case NumberShape.RECTANGLE: {
          this.drawRectangle();
          break;
        }
        case NumberShape.TRIANGLE: {
          this.drawTriangle();
          break;
        }
        case NumberShape.DOT: {
          this.drawDot(quantity);
          break;
        }
        case NumberShape.TEXT: {
          this.drawText(quantity);
          break;
        }
        case NumberShape.EMPTY: {
          break;
        }
      }
    });
  }

  drawLetterShape(shapes: [LetterShape, Map<string, number>][]) {
    this.clear();
    shapes.forEach(([shape, args]) => {
      switch (shape) {
        case LetterShape.NARROWRECT: {
          this.drawNarrowRectangle();
          break;
        }
        case LetterShape.HORRIZONTALLINE: {
          this.drawHorrizontalLines(args);
          break;
        }
        case LetterShape.TRIANGLES: {
          this.drawTriangles(args);
          break;
        }
        case LetterShape.ARCS: {
          this.drawArcs(args);
          break;
        }
        case LetterShape.EMPTY: {
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

  drawNarrowRectangle() {
    const lineWidth = 5;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeRect(
      lineWidth / 2,
      lineWidth / 2,
      this.width / 2 - lineWidth / 2,
      this.height - lineWidth
    );
  }

  drawHorrizontalLines(args: Map<string, number>) {
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = "#000000";
    const numberOfLines = args.get("lines") || 0;
    const offsetX = args.get("offsetX") || 0;
    const diffY = this.height / (numberOfLines + 1);
    if (args.has("colored")) {
      this.ctx.strokeStyle = "#ffa500";
    }
    for (let i = 0; i < numberOfLines; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(offsetX * this.width, (i + 1) * diffY);
      this.ctx.lineTo(offsetX * this.width + this.width / 2, (i + 1) * diffY);
      this.ctx.stroke();
    }
  }

  drawTriangles(args: Map<string, number>) {
    this.ctx.lineWidth = 5;
    this.ctx.lineJoin = "bevel";
    this.ctx.strokeStyle = "#ffa500";
    const numberOfTriangles = args.get("triangles") || 0;
    const offsetX = args.get("offsetX") || 0;
    if (numberOfTriangles <= 0) {
      return;
    }
    this.ctx.beginPath();
    this.ctx.moveTo(offsetX * this.width, this.height);
    this.ctx.lineTo(offsetX * this.width, 0);
    const diffY = this.height / (2 * numberOfTriangles);
    for (let i = 1; i <= numberOfTriangles; i++) {
      this.ctx.lineTo(this.width, (2 * i - 1) * diffY);
      this.ctx.lineTo(offsetX * this.width, 2 * i * diffY);
    }
    this.ctx.stroke();
  }

  drawArcs(args: Map<string, number>) {
    const lineWidth = 5;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = "#ffa500";
    const numberOfArcs = args.get("arcs") || 0;
    const offsetX = args.get("offsetX") || 0;
    if (numberOfArcs <= 0) {
      return;
    }
    this.ctx.beginPath();
    this.ctx.moveTo(offsetX * this.width, this.height);
    this.ctx.lineTo(offsetX * this.width, 0);
    const diffY = this.height / (2 * numberOfArcs);
    for (let i = 1; i <= numberOfArcs; i++) {
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
}

export const NumberShapeTable: [NumberShape, number][][] = [
  [[NumberShape.EMPTY, 0]],
  [[NumberShape.DOT, 1]],
  [[NumberShape.DOT, 2]],
  [[NumberShape.DOT, 3]],
  [[NumberShape.DOT, 4]],
  [[NumberShape.RECTANGLE, 1]],
  [[NumberShape.TEXT, 0]],
  [[NumberShape.TEXT, 1]],
  [[NumberShape.TEXT, 2]],
  [[NumberShape.TEXT, 3]],
  [[NumberShape.CIRCLE, 1]],
  [[NumberShape.TEXT, 4]],
  [[NumberShape.TEXT, 5]],
  [[NumberShape.TEXT, 6]],
  [[NumberShape.TEXT, 7]],
  [[NumberShape.TRIANGLE, 1]],
  [[NumberShape.TEXT, 8]],
  [[NumberShape.TEXT, 9]],
  [[NumberShape.EMPTY, 0]],
  [[NumberShape.EMPTY, 0]],
];

export const NumberShapeLookupTable: Map<
  number,
  [NumberShape, number][]
> = new Map([
  [
    0,
    [
      [NumberShape.RECTANGLE, 1],
      [NumberShape.DOT, 1],
    ],
  ],
  [
    1,
    [
      [NumberShape.RECTANGLE, 1],
      [NumberShape.DOT, 2],
    ],
  ],
  [
    2,
    [
      [NumberShape.RECTANGLE, 1],
      [NumberShape.DOT, 3],
    ],
  ],
  [
    3,
    [
      [NumberShape.RECTANGLE, 1],
      [NumberShape.DOT, 4],
    ],
  ],
  [
    4,
    [
      [NumberShape.CIRCLE, 1],
      [NumberShape.DOT, 1],
    ],
  ],
  [
    5,
    [
      [NumberShape.CIRCLE, 1],
      [NumberShape.DOT, 2],
    ],
  ],
  [
    6,
    [
      [NumberShape.CIRCLE, 1],
      [NumberShape.DOT, 3],
    ],
  ],
  [
    7,
    [
      [NumberShape.CIRCLE, 1],
      [NumberShape.DOT, 4],
    ],
  ],
  [
    8,
    [
      [NumberShape.TRIANGLE, 1],
      [NumberShape.DOT, 1],
    ],
  ],
  [
    9,
    [
      [NumberShape.TRIANGLE, 1],
      [NumberShape.DOT, 2],
    ],
  ],
]);

export const LetterShapeTable: [LetterShape, Map<string, number>][][] = [
  [[LetterShape.EMPTY, null]],
  [
    [
      LetterShape.HORRIZONTALLINE,
      new Map([
        ["lines", 1],
        ["colored", 0],
        ["offsetX", 0.5],
      ]),
    ],
  ],
  [
    [
      LetterShape.HORRIZONTALLINE,
      new Map([
        ["lines", 2],
        ["colored", 0],
        ["offsetX", 0.5],
      ]),
    ],
  ],
  [
    [
      LetterShape.HORRIZONTALLINE,
      new Map([
        ["lines", 3],
        ["colored", 0],
        ["offsetX", 0.5],
      ]),
    ],
  ],
  [
    [
      LetterShape.TRIANGLES,
      new Map([
        ["triangles", 1],
        ["offsetX", 0.5],
      ]),
    ],
  ],
  [
    [
      LetterShape.TRIANGLES,
      new Map([
        ["triangles", 2],
        ["offsetX", 0.5],
      ]),
    ],
  ],
  [
    [
      LetterShape.TRIANGLES,
      new Map([
        ["triangles", 3],
        ["offsetX", 0.5],
      ]),
    ],
  ],
  [
    [
      LetterShape.ARCS,
      new Map([
        ["arcs", 1],
        ["offsetX", 0.5],
      ]),
    ],
  ],
  [
    [
      LetterShape.ARCS,
      new Map([
        ["arcs", 2],
        ["offsetX", 0.5],
      ]),
    ],
  ],
  [
    [
      LetterShape.ARCS,
      new Map([
        ["arcs", 3],
        ["offsetX", 0.5],
      ]),
    ],
  ],
  [
    [LetterShape.NARROWRECT, null],
    [LetterShape.HORRIZONTALLINE, new Map([["lines", 1]])],
  ],
  [[LetterShape.EMPTY, null]],
  [[LetterShape.EMPTY, null]],
  [[LetterShape.EMPTY, null]],
  [[LetterShape.EMPTY, null]],
  [[LetterShape.EMPTY, null]],
  [[LetterShape.EMPTY, null]],
  [[LetterShape.EMPTY, null]],
  [[LetterShape.EMPTY, null]],
  [[LetterShape.EMPTY, null]],
  [
    [LetterShape.NARROWRECT, null],
    [LetterShape.HORRIZONTALLINE, new Map([["lines", 2]])],
  ],
  [[LetterShape.EMPTY, null]],
  [[LetterShape.EMPTY, null]],
  [[LetterShape.EMPTY, null]],
  [[LetterShape.EMPTY, null]],
  [[LetterShape.EMPTY, null]],
  [[LetterShape.EMPTY, null]],
  [[LetterShape.EMPTY, null]],
  [[LetterShape.EMPTY, null]],
  [[LetterShape.EMPTY, null]],
  [
    [LetterShape.NARROWRECT, null],
    [LetterShape.HORRIZONTALLINE, new Map([["lines", 3]])],
  ],
  [[LetterShape.EMPTY, null]],
  [[LetterShape.EMPTY, null]],
  [[LetterShape.EMPTY, null]],
  [[LetterShape.EMPTY, null]],
  [[LetterShape.EMPTY, null]],
  [[LetterShape.EMPTY, null]],
  [[LetterShape.EMPTY, null]],
  [[LetterShape.EMPTY, null]],
  [[LetterShape.EMPTY, null]],
];

export const dummy: Map<string, [LetterShape, Map<string, number>][]> = new Map(
  [
    [
      "A",
      [
        [LetterShape.NARROWRECT, null],
        [LetterShape.HORRIZONTALLINE, new Map([["lines", 1]])],
        [
          LetterShape.HORRIZONTALLINE,
          new Map([
            ["lines", 1],
            ["colored", 0],
            ["offsetX", 0.5],
          ]),
        ],
      ],
    ],
    [
      "B",
      [
        [LetterShape.NARROWRECT, null],
        [LetterShape.HORRIZONTALLINE, new Map([["lines", 1]])],
        [
          LetterShape.HORRIZONTALLINE,
          new Map([
            ["lines", 2],
            ["colored", 0],
            ["offsetX", 0.5],
          ]),
        ],
      ],
    ],
    [
      "C",
      [
        [LetterShape.NARROWRECT, null],
        [LetterShape.HORRIZONTALLINE, new Map([["lines", 1]])],
        [
          LetterShape.HORRIZONTALLINE,
          new Map([
            ["lines", 3],
            ["colored", 0],
            ["offsetX", 0.5],
          ]),
        ],
      ],
    ],
    [
      "D",
      [
        [LetterShape.NARROWRECT, null],
        [LetterShape.HORRIZONTALLINE, new Map([["lines", 1]])],
        [
          LetterShape.TRIANGLES,
          new Map([
            ["triangles", 1],
            ["colored", 0],
            ["offsetX", 0.5],
          ]),
        ],
      ],
    ],
    [
      "E",
      [
        [LetterShape.NARROWRECT, null],
        [LetterShape.HORRIZONTALLINE, new Map([["lines", 1]])],
        [
          LetterShape.TRIANGLES,
          new Map([
            ["triangles", 2],
            ["colored", 0],
            ["offsetX", 0.5],
          ]),
        ],
      ],
    ],
    [
      "F",
      [
        [LetterShape.NARROWRECT, null],
        [LetterShape.HORRIZONTALLINE, new Map([["lines", 1]])],
        [
          LetterShape.TRIANGLES,
          new Map([
            ["triangles", 3],
            ["colored", 0],
            ["offsetX", 0.5],
          ]),
        ],
      ],
    ],
    [
      "G",
      [
        [LetterShape.NARROWRECT, null],
        [LetterShape.HORRIZONTALLINE, new Map([["lines", 1]])],
        [
          LetterShape.ARCS,
          new Map([
            ["arcs", 1],
            ["colored", 0],
            ["offsetX", 0.5],
          ]),
        ],
      ],
    ],
    [
      "H",
      [
        [LetterShape.NARROWRECT, null],
        [LetterShape.HORRIZONTALLINE, new Map([["lines", 1]])],
        [
          LetterShape.ARCS,
          new Map([
            ["arcs", 2],
            ["colored", 0],
            ["offsetX", 0.5],
          ]),
        ],
      ],
    ],
    [
      "I",
      [
        [LetterShape.NARROWRECT, null],
        [LetterShape.HORRIZONTALLINE, new Map([["lines", 1]])],
        [
          LetterShape.ARCS,
          new Map([
            ["arcs", 3],
            ["colored", 0],
            ["offsetX", 0.5],
          ]),
        ],
      ],
    ],
    [
      "J",
      [
        [LetterShape.NARROWRECT, null],
        [LetterShape.HORRIZONTALLINE, new Map([["lines", 2]])],
        [
          LetterShape.HORRIZONTALLINE,
          new Map([
            ["lines", 1],
            ["colored", 0],
            ["offsetX", 0.5],
          ]),
        ],
      ],
    ],
    [
      "K",
      [
        [LetterShape.NARROWRECT, null],
        [LetterShape.HORRIZONTALLINE, new Map([["lines", 2]])],
        [
          LetterShape.HORRIZONTALLINE,
          new Map([
            ["lines", 2],
            ["colored", 0],
            ["offsetX", 0.5],
          ]),
        ],
      ],
    ],
    [
      "L",
      [
        [LetterShape.NARROWRECT, null],
        [LetterShape.HORRIZONTALLINE, new Map([["lines", 2]])],
        [
          LetterShape.HORRIZONTALLINE,
          new Map([
            ["lines", 3],
            ["colored", 0],
            ["offsetX", 0.5],
          ]),
        ],
      ],
    ],
    [
      "N",
      [
        [LetterShape.NARROWRECT, null],
        [LetterShape.HORRIZONTALLINE, new Map([["lines", 2]])],
        [
          LetterShape.TRIANGLES,
          new Map([
            ["trianglesl", 2],
            ["colored", 0],
            ["offsetX", 0.5],
          ]),
        ],
      ],
    ],
    [
      "O",
      [
        [LetterShape.NARROWRECT, null],
        [LetterShape.HORRIZONTALLINE, new Map([["lines", 2]])],
        [
          LetterShape.TRIANGLES,
          new Map([
            ["trianglesl", 3],
            ["colored", 0],
            ["offsetX", 0.5],
          ]),
        ],
      ],
    ],
    [
      "P",
      [
        [LetterShape.NARROWRECT, null],
        [LetterShape.HORRIZONTALLINE, new Map([["lines", 2]])],
        [
          LetterShape.ARCS,
          new Map([
            ["arcs", 1],
            ["colored", 0],
            ["offsetX", 0.5],
          ]),
        ],
      ],
    ],
    [
      "Q",
      [
        [LetterShape.NARROWRECT, null],
        [LetterShape.HORRIZONTALLINE, new Map([["lines", 2]])],
        [
          LetterShape.ARCS,
          new Map([
            ["arcs", 2],
            ["colored", 0],
            ["offsetX", 0.5],
          ]),
        ],
      ],
    ],
    [
      "R",
      [
        [LetterShape.NARROWRECT, null],
        [LetterShape.HORRIZONTALLINE, new Map([["lines", 2]])],
        [
          LetterShape.ARCS,
          new Map([
            ["arcs", 3],
            ["colored", 0],
            ["offsetX", 0.5],
          ]),
        ],
      ],
    ],
    [
      "S",
      [
        [LetterShape.NARROWRECT, null],
        [LetterShape.HORRIZONTALLINE, new Map([["lines", 3]])],
        [
          LetterShape.HORRIZONTALLINE,
          new Map([
            ["lines", 1],
            ["colored", 0],
            ["offsetX", 0.5],
          ]),
        ],
      ],
    ],
    [
      "T",
      [
        [LetterShape.NARROWRECT, null],
        [LetterShape.HORRIZONTALLINE, new Map([["lines", 3]])],
        [
          LetterShape.HORRIZONTALLINE,
          new Map([
            ["lines", 2],
            ["colored", 0],
            ["offsetX", 0.5],
          ]),
        ],
      ],
    ],
    [
      "U",
      [
        [LetterShape.NARROWRECT, null],
        [LetterShape.HORRIZONTALLINE, new Map([["lines", 3]])],
        [
          LetterShape.HORRIZONTALLINE,
          new Map([
            ["lines", 3],
            ["colored", 0],
            ["offsetX", 0.5],
          ]),
        ],
      ],
    ],
    [
      "V",
      [
        [LetterShape.NARROWRECT, null],
        [LetterShape.HORRIZONTALLINE, new Map([["lines", 3]])],
        [
          LetterShape.TRIANGLES,
          new Map([
            ["triangles", 1],
            ["colored", 0],
            ["offsetX", 0.5],
          ]),
        ],
      ],
    ],
    [
      "W",
      [
        [LetterShape.NARROWRECT, null],
        [LetterShape.HORRIZONTALLINE, new Map([["lines", 3]])],
        [
          LetterShape.TRIANGLES,
          new Map([
            ["triangles", 2],
            ["colored", 0],
            ["offsetX", 0.5],
          ]),
        ],
      ],
    ],
    [
      "X",
      [
        [LetterShape.NARROWRECT, null],
        [LetterShape.HORRIZONTALLINE, new Map([["lines", 3]])],
        [
          LetterShape.TRIANGLES,
          new Map([
            ["triangles", 3],
            ["colored", 0],
            ["offsetX", 0.5],
          ]),
        ],
      ],
    ],
    [
      "Y",
      [
        [LetterShape.NARROWRECT, null],
        [LetterShape.HORRIZONTALLINE, new Map([["lines", 3]])],
        [
          LetterShape.ARCS,
          new Map([
            ["arcs", 1],
            ["colored", 0],
            ["offsetX", 0.5],
          ]),
        ],
      ],
    ],
    [
      "Z",
      [
        [LetterShape.NARROWRECT, null],
        [LetterShape.HORRIZONTALLINE, new Map([["lines", 3]])],
        [
          LetterShape.ARCS,
          new Map([
            ["arcs", 2],
            ["colored", 0],
            ["offsetX", 0.5],
          ]),
        ],
      ],
    ],
  ]
);
