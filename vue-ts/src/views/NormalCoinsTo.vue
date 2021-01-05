<template>
  <Game :type="type" :title="title" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Game, { GameType } from "../components/Game.vue";
import views from "./Views";

@Component<NormalCoinsTo>({
  components: {
    Game,
  },
})
export default class NormalCoinsTo extends Vue {
  type: GameType = GameType.COINSTO;
  title = views.find((el) => el.component === GameType.COINSTO).title;
  video = "placeholder.mp4";
  description = "";
}
</script>
