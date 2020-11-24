import Vue from "vue";

export enum EventBusEvents {
  RestartGame = "restart_game",
  EvaluateGame = "eval_game",
}

export const EventBus = new Vue();
