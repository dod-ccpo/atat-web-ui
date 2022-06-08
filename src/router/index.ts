import VueRouter from "vue-router";
import {stepperRoutes} from "./stepper";
import PathResolver from "./resolvers/PathResolver.vue";
import RouteResolver from "./resolvers/RouteResolver.vue";

const routes = [
  ...stepperRoutes,
  {
    name: 'routeResolver',
    component: RouteResolver,
    path: '/routeResolver'
  },
  {
    name: 'pathResolver',
    component: PathResolver,
    path: '/pathResolver'
  }
];

const router = new VueRouter({
  routes, // short for `routes: routes`
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

export default router;
