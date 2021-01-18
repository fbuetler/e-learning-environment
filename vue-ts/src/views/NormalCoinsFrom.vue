<template>
  <Game :type="type" :args="args">
    <h2 slot="title">{{ title }}</h2>
    <div slot="description">
      <p>
        In Unterbiberland bezahlt man mit Münzen der Grösse 1, 2, 5, 10, 20 und
        50.
      </p>
      <div class="flex-item flex-center flex-row">
        <div><img :src="require('@/assets/coins/normal/fifty.png')" /></div>
        <div><img :src="require('@/assets/coins/normal/twenty.png')" /></div>
        <div><img :src="require('@/assets/coins/normal/ten.png')" /></div>
        <div><img :src="require('@/assets/coins/normal/five.png')" /></div>
        <div><img :src="require('@/assets/coins/normal/two.png')" /></div>
        <div><img :src="require('@/assets/coins/normal/one.png')" /></div>
      </div>
      <p>
        Welche Summe ergeben die bereitgelegten Münzen?
      </p>
    </div>
    <video loop controls muted slot="video">
      <source :src="require('@/assets/tutorials/' + video)" />
      Your browser does not support the video tag.
    </video>
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
  video = "normalfrom.mp4";
  description = ``;
}
</script>

<style scoped>
img {
  height: 3em;
}
</style>
