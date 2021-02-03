<template>
  <div id="button-menu" class="flex-item flex-row flex-center flex-wrap">
    <button
      id="button-menu-next"
      class="card clickable"
      @click="emitStartEvent()"
    >
      Nächstes Rätsel!
    </button>
    <button
      id="button-menu-check"
      class="card clickable"
      @click="emitEvalGameEvent()"
    >
      Überprüfen!
    </button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { EventBus, EventBusEvents } from "@/components/EventBus";

@Component
export default class Buttonmenu extends Vue {
  emitStartEvent() {
    EventBus.$emit(EventBusEvents.Start);
  }
  emitEvalGameEvent() {
    EventBus.$emit(EventBusEvents.EvaluateGame);
  }
}
</script>

<style scoped></style>
