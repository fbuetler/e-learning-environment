<template>
  <Game :type="type" :title="title" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Game, { GameType } from "../components/Game.vue";

@Component({
  components: {
    Game,
  },
})
export default class WordsAdd extends Vue {
  private type: GameType = GameType.WORDSADD;
  private title = "Ähnliche Wörter (hinzufügen)";
}
</script>
