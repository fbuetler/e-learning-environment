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
export default class TreeRowOfThree extends Vue {
  type: GameType = GameType.TREEROW;
  title = views.find((el) => el.component === "TreeRowOfThree").title;
  args = { size: 3 };
  video = "placeholder.mp4";
  description = "intentionally empty";
}
</script>
