<template>
  <div class="buttons-container">
    <button @click="emitRestartGameEvent()">
      {{ restartGameText }}
    </button>
    <button @click="emitEvalGameEvent()">
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
input:focus,
select:focus,
textarea:focus,
button:focus {
  outline: none;
}

.buttons-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
button {
  border-radius: 6px;
  background-color: white;
  border: none;
  color: black;
  font-size: 16px;
  padding: 10px;
  width: 230px;
  cursor: pointer;
  font-weight: bold;
  margin: 0 1em 1em 1em;
}
</style>
