<template>
  <Game :type="type" :title="title" :video="video" :description="description" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Game, { GameType } from "../components/Game.vue";
import views from "./Views";

@Component<MayasTo>({
  components: {
    Game,
  },
})
export default class MayasTo extends Vue {
  type: GameType = GameType.MAYASTO;
  title = views.find((el) => el.component === GameType.MAYASTO).title;
  video = "placeholder.mp4";
  description = `Der Maya‐Stamm der Biber verwendet Nüsse und Hölzchen, 
  um Zahlen darzustellen. In jeder Darstellung dürfen höchstens vier 
  Nüsse vorkommen. Immer wenn fünf Nüsse zusammenkommen, müssen sie 
  gegen ein Hölzchen ausgetauscht werden. Stelle die Zahl in Nüssen 
  und Hölzchen dar.`;
}
</script>
