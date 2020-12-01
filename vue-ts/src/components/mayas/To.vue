<template>
  <div>
    <div>{{ number }}</div>
    <div class="paper"></div>
    <hr />
    <div class="interaction-container">
      <NutsAndSticks :selected="selected" @selected="selected = $event" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { EventBus, EventBusEvents } from "../EventBus";
import NutsAndSticks from "@/components/mayas/NutsAndSticks.vue";

@Component<To>({
  components: {
    NutsAndSticks,
  },
})
export default class To extends Vue {
  private number: number = null;
  private selected = 0;

  created() {
    if (this.number === null) {
      this.restartGame();
    }
    EventBus.$on(EventBusEvents.RestartGame, () => this.restartGame());
    EventBus.$on(EventBusEvents.EvaluateGame, () => this.evaluateGame());
  }

  private restartGame() {
    this.number = 17;
  }

  private evaluateGame() {
    const isCorrect = true;
    this.$emit("evaluated-game", isCorrect);
  }
}
</script>

<style scoped>
.paper {
  border: solid 1px black;
}
</style>
