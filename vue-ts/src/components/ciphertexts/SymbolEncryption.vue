<template>
  <div>
    {{ noun }}
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "../Game";
import { LoadRandomElement } from "./Ciphertext";

@Component<SymbolEncryption>({})
export default class SymbolEncryption extends Mixins(GameMixin)
  implements GameInterface {
  noun: string = null;
  dataKey = "nouns";

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

<style scoped></style>
