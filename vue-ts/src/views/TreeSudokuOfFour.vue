<template>
  <Game
    :type="type"
    :title="title"
    :args="args"
    :video="video"
    :description="description"
  />
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
export default class TreeSudokuOfFour extends Vue {
  type: GameType = GameType.TREESUDOKU;
  size = 4;
  title = views.find((el) => el.component === "TreeSudokuOfFour").title;
  args = { size: this.size };
  video = "placeholder.mp4";
  description = "intentionally empty";
}
</script>
