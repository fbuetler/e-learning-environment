<template>
  <Game :type="type" :args="args">
    <h2 slot="title">{{ title }}</h2>
    <div slot="description">
      <p>
        In Unterbiberland bezahlt man mit Münzen der Grösse 1, 2, 5, 10, 20 und
        50.
      </p>
      <div class="flex-item flex-center flex-row">
        <div>
          <img :src="require('@/assets/numbersystems/decimal/fifty.png')" />
        </div>
        <div>
          <img :src="require('@/assets/numbersystems/decimal/twenty.png')" />
        </div>
        <div>
          <img :src="require('@/assets/numbersystems/decimal/ten.png')" />
        </div>
        <div>
          <img :src="require('@/assets/numbersystems/decimal/five.png')" />
        </div>
        <div>
          <img :src="require('@/assets/numbersystems/decimal/two.png')" />
        </div>
        <div>
          <img :src="require('@/assets/numbersystems/decimal/one.png')" />
        </div>
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

@Component<NormalCoinsTo>({
  components: {
    Game,
  },
})
export default class NormalCoinsTo extends Vue {
  type: GameType = GameType.NUMBERSYSTEMSTO;
  title = views.find((el) => el.component === "NormalCoinsTo").title;
  args = { numbersystemType: numbersystemType.DECIMAL };
  video = "normalto.mp4";
  description = "";
}
</script>

<style scoped>
img {
  height: 3em;
}
</style>
