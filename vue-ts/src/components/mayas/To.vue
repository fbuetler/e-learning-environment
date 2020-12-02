<template>
  <div>
    <div class="number">{{ number }}</div>
    <div class="paper"></div>
    <hr />
    <div class="interaction-container">
      <NutsAndSticks :selected="selected" @selected="selected = $event" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "../Game";
import NutsAndSticks from "@/components/mayas/NutsAndSticks.vue";

@Component<To>({
  components: {
    NutsAndSticks,
  },
})
export default class To extends Mixins(GameMixin) implements GameInterface {
  private number: number = null;
  private selected = 0;

  private limit = 19;

  isStarted(): boolean {
    return this.number == null;
  }

  restartGame() {
    this.number = Math.ceil(Math.random() * this.limit);
  }

  isCorrect(): boolean {
    return true;
  }
}
</script>

<style scoped>
.number {
  font-size: 2em;
}
.paper {
  border: solid 1px black;
}
</style>
