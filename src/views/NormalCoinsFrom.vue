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
import { numbersystemType } from "@/components/numbersystems/NumbersystemsMixin.vue";

@Component<NormalCoinsFrom>({
  components: {
    Game,
  },
})
export default class NormalCoinsFrom extends Vue {
  type: GameType = GameType.NUMBERSYSTEMSFROM;
  title = views.find((el) => el.component === "NormalCoinsFrom").title;
  args = { numbersystemType: numbersystemType.DECIMAL };
  video = "normalfrom.mp4";
}
</script>

<style scoped>
img {
  height: 3em;
}
</style>
