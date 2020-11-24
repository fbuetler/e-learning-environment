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
  display: grid;
  grid-template-rows: auto auto;
  justify-content: center;
}
button {
  border-radius: 6px;
  background-color: whitesmoke;
  border: none;
  color: black;
  font-size: 16px;
  padding: 10px;
  width: 230px;
  cursor: pointer;
  margin: 0px 0px 25px 0px;
  font-weight: bold;
}
</style>
