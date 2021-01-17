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
      <h4>Schwierigkeitsgrad <u>leicht</u>:</h4>
      <p>
        Bezahle die gegebene Summe mit Münzen aus Unterbiberland. Verwende dazu
        die Münzen.
      </p>
      <h4>Schwierigkeitsgrad <u>mittelschwer</u>:</h4>
      <p>
        Die Einwohner und Einwohnerinnen von Unterbiberland streben an, jede
        Summe mit der kleinsten Anzahl von Münzen zu bezahlen. Bezahle die
        gegebene Summer mit <b>möglichst wenig</b> Münzen.
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

@Component<NormalCoinsTo>({
  components: {
    Game,
  },
})
export default class NormalCoinsTo extends Vue {
  type: GameType = GameType.COINSTO;
  title = views.find((el) => el.component === GameType.COINSTO).title;
  args = { coinType: coinType.NORMAL };
  video = "placeholder.mp4";
  description = "";
}
</script>

<style scoped>
img {
  height: 3em;
}
</style>
