<template>
  <Game :type="type" :title="title" :video="video" :description="description" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Game, { GameType } from "../components/Game.vue";
import views from "./Views";

@Component<MayasAddition>({
  components: {
    Game,
  },
})
export default class MayasAddition extends Vue {
  type: GameType = GameType.MAYASADDITION;
  title = views.find((el) => el.component === GameType.MAYASADDITION).title;
  video = "placeholder.mp4";
  description = "intentionally empty";
}
</script>
