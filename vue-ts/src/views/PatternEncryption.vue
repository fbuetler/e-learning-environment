<template>
  <Game :type="type" :title="title" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Game, { GameType } from "../components/Game.vue";

export const patternEncryptionTitle = "Sätze mit Muster chiffrieren";

@Component<PatternEncryption>({
  components: {
    Game,
  },
})
export default class PatternEncryption extends Vue {
  private type: GameType = GameType.PATTERNENCRYPTION;
  get title(): string {
    return patternEncryptionTitle;
  }
}
</script>
