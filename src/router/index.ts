import VueRouter from "vue-router";
import {stepperRoutes} from "./stepper";
import Resolver from "./resolvers/Resolver.vue";

const routes = [
  ...stepperRoutes,
  {
    name: 'resolver',
    component: Resolver,
    path: '/resolver'
  },
];

const router = new VueRouter({
  routes, // short for `routes: routes`
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

export default router;
