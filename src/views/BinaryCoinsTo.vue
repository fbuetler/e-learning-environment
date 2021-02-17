<template>
  <Game :type="type" :args="args">
    <h2 slot="title">{{ title }}</h2>
    <div slot="description">
      <p>
        In Oberbiberland verwendet man die Bibercoins der folgenden Grösse
      </p>
      <div class="flex-item flex-center flex-row">
        <div>
          <img :src="require('@/assets/numbersystems/binary/sixtyfour.png')" />
        </div>
        <div>
          <img :src="require('@/assets/numbersystems/binary/thirtytwo.png')" />
        </div>
        <div>
          <img :src="require('@/assets/numbersystems/binary/sixteen.png')" />
        </div>
        <div>
          <img :src="require('@/assets/numbersystems/binary/eight.png')" />
        </div>
        <div>
          <img :src="require('@/assets/numbersystems/binary/four.png')" />
        </div>
        <div>
          <img :src="require('@/assets/numbersystems/binary/two.png')" />
        </div>
        <div>
          <img :src="require('@/assets/numbersystems/binary/one.png')" />
        </div>
      </div>
      <p>
        Alle Bewohner und Bewohnerinnen von Oberbiberland halten sich an die
        binäre Regel. Die binäre Regel bedeutet, dass von jeder Münzgrösse zum
        Zahlen nur eine verwendet werden darf. So brauchen die Biber nicht zu
        viele Münzen bei sich tragen. Samira soll die gegebene Summ mit
        Bibercoins bezahlen. Welche Münzen legt sie bereit?
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
import { numbersystemType } from "@/components/numbersystems/NumbersystemsMixin.vue";

@Component<BinaryCoinsTo>({
  components: {
    Game,
  },
})
export default class BinaryCoinsTo extends Vue {
  type: GameType = GameType.NUMBERSYSTEMSTO;
  title = views.find((el) => el.component === "BinaryCoinsTo").title;
  args = { numbersystemType: numbersystemType.BINARY };
  video = "binaryto.mp4";
}
</script>

<style scoped>
img {
  height: 3em;
}
</style>
