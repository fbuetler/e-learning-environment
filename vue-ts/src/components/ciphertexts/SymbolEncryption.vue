<template>
  <div @dragend.prevent="selected = null">
    <div class="flex-item flex-col">
      <div>Verschlüssle den Text mit Hilfe der Tabelle!</div>
      <div class="flex-item flex-row flex-center">
        <div class="flex-item flex-row flex-center">
          <div>Text:</div>
          <div class="canvas-container card big-text">
            {{ originalText }}
          </div>
        </div>
        <div
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
          (symbol, rowIndex, shapeIndex) =>
            symbolSelected(symbol, rowIndex, shapeIndex)
        "
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "../Game";
import Undo from "@/components/Undo.vue";
import SymbolTable from "./SymbolTable.vue";
import {
  SymbolConfig,
  LoadRandomElement,
  LetterTable,
  LetterLookup,
  GetNewCanvas,
  Type,
} from "./Ciphertext";

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

  selected: [string, number, number] = null;

  updated() {
    this.drawShapes();
  }

  isStarted(): boolean {
    return this.originalText === null;
  }

  restartGame() {
    this.originalText = LoadRandomElement(this.dataKey).toUpperCase();
    this.encryptedText = new Array<string>();
    this.deleteAllChildren(document.getElementById("encrypted-container"));
  }

  isCorrect(): boolean {
    return this.originalText === this.encryptedText.join("");
  }

  undo() {
    this.encryptedText = new Array<string>();
    this.deleteAllChildren(document.getElementById("encrypted-container"));
  }

  symbolSelected(symbol: string, rowIndex: number, shapeIndex: number) {
    this.selected = [symbol, rowIndex, shapeIndex];
  }

  addSymbol() {
    if (this.selected === null) {
      return;
    }
    this.appendCanvas(document.getElementById("encrypted-container"));
    this.encryptedText.push(this.selected[0]);
    this.selected = null;
  }

  appendCanvas(container: HTMLElement) {
    if (container === null) {
      return;
    }
    const id = container.childElementCount;
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    canvas.setAttribute("id", `encrypted-${id}`);
    canvas.setAttribute("width", "75");
    canvas.setAttribute("height", "75");
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
