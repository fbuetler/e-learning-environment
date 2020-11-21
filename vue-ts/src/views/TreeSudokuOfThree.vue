<template>
  <Game :type="type" :title="title" :args="args" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Game, { GameType } from "@/components/Game.vue";

@Component({
  components: {
    Game,
  },
})
export default class TreeSudokuOfThree extends Vue {
  private type: GameType = GameType.TREESUDOKU;
  private size = 3;
  private title = this.size + "x" + this.size + " Baumsudoku";
  private args = { size: this.size };
}
</script>
