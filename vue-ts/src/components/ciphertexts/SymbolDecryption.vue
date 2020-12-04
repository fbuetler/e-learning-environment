<template>
  <div>
    <div>{{ noun }}</div>
    <div><canvas id="dot">Dot</canvas></div>
    <div><canvas id="rect">Rect</canvas></div>
    <div><canvas id="triangle">Triangle</canvas></div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "../Game";
import { Symbol } from "./Ciphertext";
import { LoadRandomElement } from "./Ciphertext";

@Component<SymbolDecryption>({})
export default class SymbolDecryption extends Mixins(GameMixin)
  implements GameInterface {
  noun: string = null;
  dataKey = "nouns";

  mounted() {
    const dot = new Symbol(
      document.getElementById("dot") as HTMLCanvasElement,
      100,
      100
    );
    dot.drawDot(100, true);
    dot.drawDot(50, false);

    new Symbol(
      document.getElementById("rect") as HTMLCanvasElement,
      100,
      100
    ).drawRectangle(true);
    new Symbol(
      document.getElementById("triangle") as HTMLCanvasElement,
      100,
      100
    ).drawTriangle(true);
  }

  isStarted(): boolean {
    return this.noun === null;
  }

  restartGame() {
    this.noun = LoadRandomElement(this.dataKey);
  }

  isCorrect(): boolean {
    return false;
  }
}
</script>

<style scoped></style>>
