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
export default class WordsChange extends Vue {
  private type: GameType = GameType.WORDSCHANGE;
  private title = "Ähnliche Wörter (ändern)";
}
</script>
