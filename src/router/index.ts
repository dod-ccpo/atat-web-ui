import Vue from "vue";
import VueRouter, { Route, RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Dashboard from "../views/Dashboard.vue";
import { wizard } from "../router/wizard";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    alias: ["/index.html"],
    name: "Home",
    meta: {
      title: "Home",
    },
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    meta: {
      title: "About Account Tracking and Automation Tool",
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    meta: {
      title: "My Dashboard",
    },
    component: Dashboard,
  },
  {
    path: "/sample/style",
    name: "Style",
    component: () =>
      import(/* webpackChunkName: "style" */ "../views/sample/Style.vue"),
  },
  wizard,
  {
    path: "/portfolios",
    name: "portfolios",
    meta: {
      title: "My Portfolios",
    },
    component: () =>
      import(
        /* webpackChunkName: "style" */ "../views/wizard/Step0/components/ViewPortfolio/ViewPortfolio.vue"
      ),
  },
  {
    path: "/createportfolio",
    name: "createPortfolio",
    meta: {
      title: "New Portfolio Introduction",
    },
    component: () =>
      import(
        /* webpackChunkName: "style" */ "../views/wizard/Step0/components/CreatePortfolio/CreatePortfolio.vue"
      ),
  },
  {
    path: "/profile",
    name: "profile",
    meta: {
      title: "Profile Verification",
    },
    component: () =>
      import(/* webpackChunkName: "style" */ "../views/Profile.vue"),
  },
  {
    path: "/portfoliosummary",
    name: "portfoliosummary",
    meta: {
      title: "Portfolio Summary",
    },
    component: () =>
      import(
        /* webpackChunkName: "style" */ "../views/PortfolioSummary/Index.vue"
      ),
  },
  {
    path: "/portfoliosummary/fundingtracker",
    name: "fundingtracker",
    meta: {
      title: "Funding Tracker",
    },
    component: () =>
      import(
        /* webpackChunkName: "style" */ "../views/PortfolioSummary/FundingTracker/views/FundingTracker.vue"
      ),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to: Route, from: Route, next) => {
  if (to.meta?.title) {
    document.title = "ATAT | " + to.meta.title;
  }
  next();
});

router.afterEach((to: Route, from: Route) => {
  const h1 = document.getElementsByTagName("h1");
  if (h1.length) {
    h1[0].focus();
  }
});

export default router;
