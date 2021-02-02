import Vue from "vue";

export enum EventBusEvents {
  Start = "start-game",
  EvaluateGame = "evaluate-game",
}

export const EventBus = new Vue();
