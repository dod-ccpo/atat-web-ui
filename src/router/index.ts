import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Dashboard from "../views/Dashboard.vue";

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
    path: "/wizard",
    name: "wizard",
    component: () =>
      import(/* webpackChunkName: "style" */ "../wizard/wizard.vue"),
    children: [
      {
        path: "",
        name: "addportfolio",
        component: () =>
          import(
            /* webpackChunkName: "style" */ "../wizard/Step1/views/Step1.vue"
          ),
      },
      {
        path: "editportfolio/:id",
        name: "editPortfolio",
        component: () =>
          import(
            /* webpackChunkName: "style" */ "../wizard/Step1/views/Step1.vue"
          ),
      },
      {
        path: "addfunding",
        name: "addfunding",
        component: () =>
          import(
            /* webpackChunkName: "style" */ "../wizard/Step2/views/Step2.vue"
          ),
      },
      {
        path: "fundingsummary",
        name: "fundingsummary",
        component: () =>
          import(
            /* webpackChunkName: "style" */ "../wizard/Step2/views/Step2Summary.vue"
          ),
      },
      {
        path: "editfunding/:id",
        name: "editfunding",
        props: true,
        component: () =>
          import(
            /* webpackChunkName: "style" */ "../wizard/Step2/views/Step2.vue"
          ),
      },
      {
        path: "addapplication",
        name: "addapplication",
        component: () =>
          import(
            /* webpackChunkName: "style" */ "../wizard/Step3/views/Step3.vue"
          ),
      },
      // {
      //   path: "applicationsummary",
      //   name: "applicationsummary",
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "style" */ "../wizard/Step3/views/Step3.vue"
      //     ),
      // },
      // {
      //   path: "editapplication:id",
      //   name: "editapplication",
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "style" */ "../wizard/Step3/views/Step3.vue"
      //     ),
      // },
      {
        path: "addteammembers",
        name: "addteammembers",
        component: () =>
          import(
            /* webpackChunkName: "style" */ "../wizard/Step4/views/Step4.vue"
          ),
      },
      {
        path: "reviewandsubmit",
        name: "reviewandsubmit",
        component: () =>
          import(
            /* webpackChunkName: "style" */ "../wizard/Step5/views/Step5.vue"
          ),
      },
    ],
  },
  {
    path: "/portfolios",
    name: "portfolios",
    component: () =>
      import(
        /* webpackChunkName: "style" */ "../wizard/Step0/components/ViewPortfolio/ViewPortfolio.vue"
      ),
  },
  {
    path: "/createportfolio",
    name: "createPortfolio",
    component: () =>
      import(
        /* webpackChunkName: "style" */ "../wizard/Step0/components/CreatePortfolio/CreatePortfolio.vue"
      ),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
