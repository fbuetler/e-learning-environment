<template>
  <Game :type="type" :title="title" :video="video" :description="description" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Game, { GameType } from "../components/Game.vue";
import views from "./Views";

@Component<NormalCoinsMinimalAmount>({
  components: {
    Game,
  },
})
export default class NormalCoinsMinimalAmount extends Vue {
  type: GameType = GameType.COINSMINIMALAMOUNT;
  title = views.find((el) => el.component === GameType.COINSMINIMALAMOUNT)
    .title;
  video = "placeholder.mp4";
  description = "";
}
</script>
