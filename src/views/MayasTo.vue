<template>
  <Game :type="type" :args="args">
    <h2 slot="title">{{ title }}</h2>
    <p slot="description">
      Der Maya‐Stamm der Biber verwendet Nüsse und Hölzchen, um Zahlen
      darzustellen. In jeder Darstellung dürfen höchstens vier Nüsse vorkommen.
      Immer wenn fünf Nüsse zusammenkommen, müssen sie gegen ein Hölzchen
      ausgetauscht werden. Stelle die Zahl in Nüssen und Hölzchen dar.
    </p>
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

@Component<MayasTo>({
  components: {
    Game,
  },
})
export default class MayasTo extends Vue {
  type: GameType = GameType.NUMBERSYSTEMSTO;
  args = { numbersystemType: numbersystemType.MAYA };
  title = views.find((el) => el.component === "MayasTo").title;
  video = "mayasto.mp4";
}
</script>
