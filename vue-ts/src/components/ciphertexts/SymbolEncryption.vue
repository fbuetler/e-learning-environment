<template>
  <div>
    <div class="flex-item flex-col">
      <div>Verschlüssle den Text mit Hilfe der Tabelle!</div>
      <div class="flex-item flex-row flex-center">
        <div class="flex-item flex-row flex-center equal-space">
          Text:
          <div class="canvas-container card">
            {{ originalText }}
          </div>
        </div>
        <div
          class="flex-item flex-center flex-row flex-flex equal-space dropzone"
          @click="addSymbol()"
        >
          <div v-if="encryptedText.length === 0">
            Platziere hier die Symbole
          </div>
          <div class="canvas-container" v-else>
            <canvas
              v-for="(part, index) in original"
              :key="index"
              :id="'encrypted-' + index"
              width="75"
              height="75"
              >{{ part }}</canvas
            >
          </div>
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

  mounted() {
    this.drawShapes();
  }

  updated() {
    this.drawShapes();
  }

  isStarted(): boolean {
    return this.originalText === null;
  }

  restartGame() {
    this.originalText = LoadRandomElement(this.dataKey).toUpperCase();
    this.encryptedText = new Array<string>();
  }

  isCorrect(): boolean {
    return this.originalText === this.encryptedText.join("");
  }

  undo() {
    this.encryptedText = new Array<string>();
  }

  symbolSelected(symbol: string, rowIndex: number, shapeIndex: number) {
    this.selected = [symbol, rowIndex, shapeIndex];
  }

  addSymbol() {
    if (this.selected === null) {
      return;
    }
    this.encryptedText.push(this.selected[0]);
    this.selected = null;
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
