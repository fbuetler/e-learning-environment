<template>
  <div @dragend.prevent="selected = null">
    <slot name="animation" :animationSteps="animationSteps" />
    <div class="flex-item flex-col">
      <div>Verschlüssle den Text mit Hilfe der Tabelle!</div>
      <div class="flex-item flex-row flex-center">
        <div class="flex-item flex-row flex-center">
          <div>Text:</div>
          <div id="text" class="canvas-container card big-text">
            {{ originalText }}
          </div>
        </div>
        <div
          id="dropzone"
          class="flex-item flex-center flex-row flex-flex dropzone"
          @click="addSymbol()"
          @dragover.prevent
          @dragend.prevent
          @drop.stop.prevent="addSymbol()"
        >
          <div v-if="encryptedText.length === 0">
            Platziere hier die Symbole
          </div>
          <div id="encrypted-container" class="canvas-container"></div>
        </div>
        <Undo @undo-operation="undo()" />
      </div>
      <SymbolTable
        :table="table"
        :type="type"
        :selected="selected"
        @symbol-selected="
          (rowIndex, shapeIndex) => (selected = [rowIndex, shapeIndex])
        "
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "@/components/GameMixins.vue";
import Undo from "@/components/Undo.vue";
import SymbolTable from "@/components/ciphertexts/SymbolTable.vue";
import {
  SymbolConfig,
  LoadRandomElement,
  LetterTable,
  LetterLookup,
  GetNewCanvas,
  Type,
  Shape,
} from "@/components/ciphertexts/Ciphertext";

@Component<SymbolEncryption>({
  components: {
    SymbolTable,
    Undo,
  },
})
export default class SymbolEncryption extends Mixins(GameMixin)
  implements GameInterface {
  dataKey = "nouns";

  originalText: string = null;
  encryptedText: string[] = null;

  selected: [number, number] = null;
  animationSteps: Array<string> = null;

  updated() {
    this.drawShapes();
  }

  isStarted(): boolean {
    return this.originalText === null;
  }

  restart() {
    this.originalText = LoadRandomElement(this.dataKey).toUpperCase();
    this.encryptedText = new Array<string>();
    this.deleteAllChildren(document.getElementById("encrypted-container"));
    this.animationSteps = this.getAnimationSteps();
  }

  isCorrect(): boolean {
    return this.originalText === this.encryptedText.join("");
  }

  undo() {
    this.encryptedText = new Array<string>();
    this.deleteAllChildren(document.getElementById("encrypted-container"));
  }

  addSymbol() {
    if (this.selected === null) {
      return;
    }
    this.appendCanvas(document.getElementById("encrypted-container"));
    this.encryptedText.push(
      this.getSymboltext(this.selected[0], this.selected[1])
    );
    this.selected = null;
  }

  appendCanvas(container: HTMLElement) {
    if (container === null) {
      return;
    }
    const id = container.childElementCount;
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    canvas.setAttribute("id", `encrypted-${id}`);
    canvas.setAttribute("width", "50");
    canvas.setAttribute("height", "50");
    canvas.innerText = "encrypted symbol";
    container.appendChild(canvas);
  }

  deleteAllChildren(container: HTMLElement) {
    if (container === null) {
      return;
    }
    container.innerHTML = "";
  }

  drawShapes() {
    this.encryptedText.forEach((part, index) => {
      const cvText = GetNewCanvas(
        this.type,
        document.getElementById(`encrypted-${index}`) as HTMLCanvasElement
      );
      cvText.draw(this.lookup.get(part));
    });
  }

  getAnimationSteps(): Array<string> {
    const correctText = this.originalText;
    let wrongText: string;
    do {
      wrongText = Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substr(0, correctText.length)
        .toUpperCase();
    } while (wrongText === correctText);

    const mapToEncrypted = (word: string): string[] => {
      return word.split("").flatMap((el) => {
        const [rowIndex, shapeIndex] = this.findSymbol(el);
        return [`shape-${rowIndex}-${shapeIndex}`, "dropzone"];
      });
    };

    return mapToEncrypted(wrongText)
      .concat(["button-menu-check", "undo"])
      .concat(mapToEncrypted(correctText))
      .concat(["button-menu-check", "button-menu-next"]);
  }

  findSymbol(symbol: string): [number, number] {
    for (let i = 0; i < this.table.length; i++) {
      for (let j = 0; j < this.table[i].length; j++) {
        if (symbol === this.getSymboltext(i, j)) {
          return [i, j];
        }
      }
    }
    // should never be reached
    return [0, 0];
  }

  getSymboltext(rowIndex: number, shapeIndex: number): string {
    const symbol = this.table[rowIndex][shapeIndex].find(
      (shape) => shape[0] === Shape.TEXT
    );
    return symbol !== undefined ? (symbol[1].get("text") as string) : "";
  }

  get original(): string[] {
    return this.originalText.split("");
  }

  get table(): SymbolConfig[][] {
    return LetterTable;
  }

  get lookup(): Map<string, SymbolConfig> {
    return LetterLookup;
  }

  get type(): Type {
    return Type.LETTER;
  }
}
</script>

<style scoped>
.dropzone {
  min-height: 5em;
}
</style>
