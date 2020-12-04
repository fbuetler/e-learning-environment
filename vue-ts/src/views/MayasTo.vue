<template>
  <Game :type="type" :title="title" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Game, { GameType } from "../components/Game.vue";
import views from "./Views";

@Component<MayasTo>({
  components: {
    Game,
  },
})
export default class MayasTo extends Vue {
  private type: GameType = GameType.MAYASTO;
  title = views.find((el) => el.component === this.constructor.name).title;
}
</script>
