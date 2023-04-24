import VueRouter from "vue-router";
import {stepperRoutes} from "./stepper";
import { provisionWorkFlowRoutes } from "./provisionWorkflow";
import PathResolver from "./resolvers/PathResolver.vue";
import RouteResolver from "./resolvers/RouteResolver.vue";
import Home from "../home/Index.vue";
import { scrollToMainTop } from "@/helpers";

const routes = [
  {
    name: "home", 
    component: Home,
    path: "/"
  },
  ...stepperRoutes,
  ...provisionWorkFlowRoutes,
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
    scrollToMainTop();
  },
});

export default router;
