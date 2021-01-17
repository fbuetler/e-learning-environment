<template>
  <Game :type="type" :args="args">
    <h2 slot="title">{{ title }}</h2>
    <div slot="description">
      <p>
        In Oberbiberland verwendet man die Bibercoins der folgenden Grösse
      </p>
      <div class="flex-item flex-center flex-row">
        <div><img :src="require('@/assets/coins/binary/sixtyfour.png')" /></div>
        <div><img :src="require('@/assets/coins/binary/thirtytwo.png')" /></div>
        <div><img :src="require('@/assets/coins/binary/sixteen.png')" /></div>
        <div><img :src="require('@/assets/coins/binary/eight.png')" /></div>
        <div><img :src="require('@/assets/coins/binary/four.png')" /></div>
        <div><img :src="require('@/assets/coins/binary/two.png')" /></div>
        <div><img :src="require('@/assets/coins/binary/one.png')" /></div>
      </div>
      <p>
        Alle Bewohner und Bewohnerinnen von Oberbiberland halten sich an die
        binäre Regel. Die binäre Regel bedeutet, dass von jeder Münzgrösse zum
        Zahlen nur eine verwendet werden darf. So brauchen die Biber nicht zu
        viele Münzen bei sich tragen. Welche Summe ergeben die bereitgelegten
        Münzen?
      </p>
    </div>
  </Game>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Game, { GameType } from "@/components/Game.vue";
import views from "@/views/Views";
import { coinType } from "@/components/coins/CoinsMixin.vue";

@Component<BinaryCoinsFrom>({
  components: {
    Game,
  },
})
export default class BinaryCoinsFrom extends Vue {
  type: GameType = GameType.COINSFROM;
  title = views.find((el) => el.component === GameType.COINSFROM).title;
  args = { coinType: coinType.BINARY };
  video = "placeholder.mp4";
  description = ``;
}
</script>

<style scoped>
img {
  height: 3em;
}
</style>
