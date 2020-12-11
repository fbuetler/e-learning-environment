<template>
  <Game :type="type" :title="title" :video="video" :description="description" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Game, { GameType } from "../components/Game.vue";
import views from "./Views";

@Component<SymbolDecryption>({
  components: {
    Game,
  },
})
export default class SymbolDecryption extends Vue {
  type: GameType = GameType.SYMBOLDECRYPTION;
  title = views.find((el) => el.component === GameType.SYMBOLDECRYPTION).title;
  video = "placeholder.mp4";
  description = "intentionally empty";
}
</script>
