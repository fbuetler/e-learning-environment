import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import views from "../views/Views";

Vue.use(VueRouter);

let routes: Array<RouteConfig> = [
  {
    path: "/",
    component: Home,
  },
];

routes = routes.concat(
  views.map((el) => {
    const rc: RouteConfig = {
      path: el.path,
      component: () => import(`@/views/${el.view}`),
    };
    return rc;
  })
);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
