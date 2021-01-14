<template>
  <Game :type="type" :args="args">
    <h2 slot="title">{{ title }}</h2>
  </Game>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Game, { GameType } from "@/components/Game.vue";
import views from "@/views/Views";
import { coinType } from "@/components/coins/CoinsMixin.vue";

@Component<NormalCoinsFrom>({
  components: {
    Game,
  },
})
export default class NormalCoinsFrom extends Vue {
  type: GameType = GameType.COINSFROM;
  title = views.find((el) => el.component === GameType.COINSFROM).title;
  args = { coinType: coinType.NORMAL };
  video = "placeholder.mp4";
  description = ``;
}
</script>
