import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/treerow3",
    name: "Reihe aus 3 Bäumen",
    component: () => import("@/views/TreeRowOfThree.vue"),
  },
  {
    path: "/treesudoku3",
    name: "3x3 Baumsudoku",
    component: () => import("@/views/TreeSudokuOfThree.vue"),
  },
  {
    path: "/treerow4",
    name: "Reihe aus 4 Bäumen",
    component: () => import("@/views/TreeRowOfFour.vue"),
  },
  {
    path: "/treesudoku4",
    name: "4x4 Baumsudoku",
    component: () => import("@/views/TreeSudokuOfFour.vue"),
  },
  {
    path: "/wordsadd",
    name: "Ähnlich Wörter (hinzufügen)",
    component: () => import("@/views/WordsAdd.vue"),
  },
  {
    path: "/wordschange",
    name: "Ähnlich Wörter (ändern)",
    component: () => import("@/views/WordsChange.vue"),
  },
  {
    path: "/wordsremove",
    name: "Ähnlich Wörter (entfernen)",
    component: () => import("@/views/WordsRemove.vue"),
  },
  {
    path: "/wordsswap",
    name: "Ähnlich Wörter (vertauschen)",
    component: () => import("@/views/WordsSwap.vue"),
  },
  {
    path: "/mayasto",
    name: "Zahlen wie die Mayas darstellen",
    component: () => import("@/views/MayasTo.vue"),
  },
  {
    path: "/mayasfrom",
    name: "Zahlen der Mayas verstehen",
    component: () => import("@/views/MayasFrom.vue"),
  },
  {
    path: "/mayasaddition",
    name: "Zahlen der Mayas addieren",
    component: () => import("@/views/MayasAddition.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
