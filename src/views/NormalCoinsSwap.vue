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
      <p>
        Die Einwohner und Einwohnerinnen von Unterbiberland streben an, jede
        Summe mit der kleinsten Anzahl von Münzen zu bezahlen. Jan, ein
        Einwohner von Unterbiberland, bezahlt den Betrag mit den dargestellten
        Münzen. Cleveria meint zu Jan: «Du kannst mit weniger Münzen die Summe
        bezahlen. Das kannst du so erreichen: Tausche mehrere kleine Münzen
        gegen eine grössere Münze aus. Der Tausch muss gleichwertig sein. Der
        Wert der grossen Münzen muss gleich der Summe der Werte der kleinen
        Münzen sein. Du kannst zum Beispiel zwei 20er Münzen plus eine 10er
        Münze gegen eine 50er Münze tauschen. Kannst du Jan helfen, weitere
        Münzen auszutauschen, bis er mit der kleinsten Anzahl Münzen bezahlt?
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

@Component<NormalSwap>({
  components: {
    Game,
  },
})
export default class NormalSwap extends Vue {
  type: GameType = GameType.NUMBERSYSTEMSSWAP;
  title = views.find((el) => el.component === GameType.NUMBERSYSTEMSSWAP).title;
  args = { numbersystemType: numbersystemType.DECIMAL };
  video = "normalswap.mp4";
  description = "";
}
</script>

<style scoped>
img {
  height: 3em;
}
</style>
