<template>
  <Game :type="type" :title="title" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Game, { GameType } from "../components/Game.vue";

@Component<MayasFrom>({
  components: {
    Game,
  },
})
export default class MayasFrom extends Vue {
  private type: GameType = GameType.MAYASFROM;
  private title = "Zahlen der Mayas verstehen";
}
</script>
