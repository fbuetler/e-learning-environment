<template>
  <Game :type="type">
    <h2 slot="title">{{ title }}</h2>
  </Game>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Game, { GameType } from "@/components/Game.vue";
import views from "@/views/Views";

@Component<NormalCoinsFrom>({
  components: {
    Game,
  },
})
export default class NormalCoinsFrom extends Vue {
  type: GameType = GameType.COINSFROM;
  title = views.find((el) => el.component === GameType.COINSFROM).title;
  video = "placeholder.mp4";
  description = ``;
}
</script>
