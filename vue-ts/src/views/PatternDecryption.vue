<template>
  <Game :type="type" :title="title" :video="video" :description="description" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Game, { GameType } from "../components/Game.vue";
import views from "./Views";

@Component<PatternDecryption>({
  components: {
    Game,
  },
})
export default class PatternDecryption extends Vue {
  type: GameType = GameType.PATTERNDECRYPTION;
  title = views.find((el) => el.component === GameType.PATTERNDECRYPTION).title;
  video = "placeholder.mp4";
  description = "intentionally empty";
}
</script>
