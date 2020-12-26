<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "../Game";

@Component<MinimalAmount>({})
export default class MinimalAmount extends Mixins(GameMixin)
  implements GameInterface {
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
