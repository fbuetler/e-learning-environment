<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "@/components/GameMixins";

@Component<Swap>({})
export default class Swap extends Mixins(GameMixin) implements GameInterface {
  isStarted(): boolean {
    return true;
  }

  restartGame() {
    return;
  }

  isCorrect(): boolean {
    return false;
  }
}
</script>

<style scoped></style>
