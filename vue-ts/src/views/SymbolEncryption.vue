<template>
  <Game :type="type" :title="title" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Game, { GameType } from "../components/Game.vue";

export const symbolEncryptionTitle = "Sätze mit Zeichen chiffrieren";

@Component<SymbolEncryption>({
  components: {
    Game,
  },
})
export default class SymbolEncryption extends Vue {
  private type: GameType = GameType.SYMBOLENCRYPTION;
  get title(): string {
    return symbolEncryptionTitle;
  }
}
</script>
