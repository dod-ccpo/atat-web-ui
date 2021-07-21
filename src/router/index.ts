import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Dashboard from "../views/Dashboard.vue";
import ViewPortfolio from "../wizard/Step_1/components/ViewPortfolio.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/sample/style",
    name: "Style",
    component: () =>
      import(/* webpackChunkName: "style" */ "../views/sample/Style.vue"),
  },
  {
    path: "/wizard/step-1",
    name: "step1",
    component: () =>
      import(
        /* webpackChunkName: "style" */ "../wizard/Step_1/views/Step_1.vue"
      ),
  },
  {
    path: "/wizard/step-2",
    name: "step2",
    component: () =>
      import(
        /* webpackChunkName: "style" */ "../wizard/Step_2/views/Step_2.vue"
      ),
  },
  {
    path: "/portfolios",
    redirect: { name: "step1" },
  },
  {
    path: "/viewportfolio",
    name: "View-portfolio",
    component: ViewPortfolio,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
