import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/treerow3",
    component: () => import("@/views/TreeRowOfThree.vue"),
  },
  {
    path: "/treesudoku3",
    component: () => import("@/views/TreeSudokuOfThree.vue"),
  },
  {
    path: "/treerow4",
    component: () => import("@/views/TreeRowOfFour.vue"),
  },
  {
    path: "/treesudoku4",
    component: () => import("@/views/TreeSudokuOfFour.vue"),
  },
  {
    path: "/wordsadd",
    component: () => import("@/views/WordsAdd.vue"),
  },
  {
    path: "/wordschange",
    component: () => import("@/views/WordsChange.vue"),
  },
  {
    path: "/wordsremove",
    component: () => import("@/views/WordsRemove.vue"),
  },
  {
    path: "/wordsswap",
    component: () => import("@/views/WordsSwap.vue"),
  },
  {
    path: "/mayasto",
    component: () => import("@/views/MayasTo.vue"),
  },
  {
    path: "/mayasfrom",
    component: () => import("@/views/MayasFrom.vue"),
  },
  {
    path: "/mayasaddition",
    component: () => import("@/views/MayasAddition.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
