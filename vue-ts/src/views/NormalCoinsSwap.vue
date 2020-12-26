<template>
  <Game :type="type" :title="title" :video="video" :description="description" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Game, { GameType } from "../components/Game.vue";
import views from "./Views";

@Component<NormalSwap>({
  components: {
    Game,
  },
})
export default class NormalSwap extends Vue {
  type: GameType = GameType.COINSSWAP;
  title = views.find((el) => el.component === GameType.COINSSWAP).title;
  video = "placeholder.mp4";
  description = "";
}
</script>
