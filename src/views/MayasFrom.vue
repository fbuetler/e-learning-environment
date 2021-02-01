<template>
  <Game :type="type" :args="args">
    <h2 slot="title">{{ title }}</h2>
    <p slot="description">
      Der Maya‐Stamm der Biber verwendet Nüsse und Hölzchen, um Zahlen
      darzustellen. Jede Nuss steht für 1, jedes Hölzchen für 5. Zum Beispiel
      stellen 3 Hölzchen mit 2 Nüssen die Zahl 3 x 5 + 2 x 1 = 17 dar. Finde
      heraus welche Zahl dargestellt wird.
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

@Component<MayasFrom>({
  components: {
    Game,
  },
})
export default class MayasFrom extends Vue {
  type: GameType = GameType.NUMBERSYSTEMSFROM;
  args = { numbersystemType: numbersystemType.MAYA };
  title = views.find((el) => el.component === "MayasFrom").title;
  video = "mayasfrom.mp4";
}
</script>
