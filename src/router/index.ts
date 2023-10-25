import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import {stepperRoutes} from "./stepper";
import { provisionWorkFlowRoutes } from "./provisionWorkflow";
import PathResolver from "./resolvers/PathResolver.vue";
import RouteResolver from "./resolvers/RouteResolver.vue";
import Home from "../home/Index.vue";
import { scrollToMainTop } from "@/helpers";

const routes: readonly RouteRecordRaw[] = [
  {
    name: "home", 
    component: Home,
    path: "/"
  },
  {
    name: 'routeResolver',
    component: RouteResolver,
    path: '/routeResolver'
  },
  {
    name: 'pathResolver',
    component: PathResolver,
    path: '/pathResolver'
  },
  ...stepperRoutes,
  ...provisionWorkFlowRoutes,
];

const router = createRouter({
  routes,
  scrollBehavior() {
    scrollToMainTop();
  },
  history: createWebHistory()
});

export default router;
