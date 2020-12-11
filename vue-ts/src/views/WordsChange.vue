<template>
  <Game :type="type" :title="title" :video="video" :description="description" />
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
export default class WordsChange extends Vue {
  type: GameType = GameType.WORDSCHANGE;
  title = views.find((el) => el.component === GameType.WORDSCHANGE).title;
  video = "placeholder.mp4";
  description = "intentionally empty";
}
</script>
