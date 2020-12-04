<template>
  <Game :type="type" :title="title" :args="args" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Game, { GameType } from "../components/Game.vue";
import views from "./Views";

@Component({
  components: {
    Game,
  },
})
export default class TreeSudokuOfThree extends Vue {
  private type: GameType = GameType.TREESUDOKU;
  private size = 3;
  title = views.find((el) => el.component === this.constructor.name).title;
  private args = { size: this.size };
}
</script>
