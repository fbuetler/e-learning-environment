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
export default class TreeSudokuOfFour extends Vue {
  private type: GameType = GameType.SUDOKU;
  private size = 4;
  private title = this.size + "x" + this.size + " Baumsudoku";
  private args = { size: this.size };
}
</script>
