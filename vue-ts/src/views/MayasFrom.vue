<template>
  <Game :type="type" :title="title" />
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
  private type: GameType = GameType.MAYASFROM;
  title = views.find((el) => el.component === GameType.MAYASFROM).title;
}
</script>
