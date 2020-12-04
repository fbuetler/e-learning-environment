<template>
  <Game :type="type" :title="title" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Game, { GameType } from "../components/Game.vue";

export const symbolDecryptionTitle = "Sätze mit Zeichen dechiffrieren";

@Component<SymbolDecryption>({
  components: {
    Game,
  },
})
export default class SymbolDecryption extends Vue {
  private type: GameType = GameType.SYMBOLDECRYPTION;
  get title(): string {
    return symbolDecryptionTitle;
  }
}
</script>
