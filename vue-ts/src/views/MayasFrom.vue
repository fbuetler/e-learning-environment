<template>
  <Game :type="type" :title="title" :video="video" :description="description" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Game, { GameType } from "../components/Game.vue";
import views from "./Views";

@Component<MayasFrom>({
  components: {
    Game,
  },
})
export default class MayasFrom extends Vue {
  type: GameType = GameType.MAYASFROM;
  title = views.find((el) => el.component === GameType.MAYASFROM).title;
  video = "placeholder.mp4";
  description = `Der Maya‐Stamm der Biber verwendet Nüsse und Hölzchen, 
  um Zahlen darzustellen. Jede Nuss steht für 1, jedes Hölzchen für 5. 
  Zum Beispiel stellen 3 Hölzchen mit 2 Nüssen die Zahl 3 x 5 + 2 x 1 = 17 
  dar. Finde heraus welche Zahl dargestellt wird.`;
}
</script>
