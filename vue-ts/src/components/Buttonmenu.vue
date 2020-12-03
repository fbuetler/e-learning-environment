<template>
  <div class="flex-item flex-row flex-center flex-wrap">
    <button class="card" @click="emitRestartGameEvent()">
      {{ restartGameText }}
    </button>
    <button class="card" @click="emitEvalGameEvent()">
      {{ evaluateGameText }}
    </button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { EventBus, EventBusEvents } from "./EventBus";

@Component
export default class Buttonmenu extends Vue {
  @Prop({ type: String, required: true })
  private restartGameText!: string;
  @Prop({ type: String, required: true })
  private evaluateGameText!: string;

  private emitRestartGameEvent() {
    EventBus.$emit(EventBusEvents.RestartGame);
  }
  private emitEvalGameEvent() {
    EventBus.$emit(EventBusEvents.EvaluateGame);
  }
}
</script>

<style scoped>
button {
  color: black;
  font-size: 16px;
  padding: 10px;
  width: 230px;
  font-weight: bold;
}
</style>
