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
export default class WordsSwap extends Vue {
  private type: GameType = GameType.WORDSSWAP;
  private title = "Ähnliche Wörter (tauschen)";
}
</script>
