<template>
  <Game :type="type" :title="title" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Game, { GameType } from "../components/Game.vue";

export const patternDecryptionTitle = "Sätze mit Muster dechiffrieren";

@Component<PatternDecryption>({
  components: {
    Game,
  },
})
export default class PatternDecryption extends Vue {
  private type: GameType = GameType.PATTERNDECRYPTION;
  get title(): string {
    return patternDecryptionTitle;
  }
}
</script>
