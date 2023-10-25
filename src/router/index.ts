import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import {stepperRoutes} from "./stepper";
import { provisionWorkFlowRoutes } from "./provisionWorkflow";
import PathResolver from "./resolvers/PathResolver.vue";
import RouteResolver from "./resolvers/RouteResolver.vue";
import Home from "../home/Index.vue";
import { scrollToMainTop } from "@/helpers";
import { StepperRouteConfig } from "types/Global";
import { Component } from "vue";

// const mapStepperRouterToRaw = (route: StepperRouteConfig): RouteRecordRaw => {
//   const { menuText, children, ...rest } = route;
//   const mappedChildren = children?.map(mapStepperRouterToRaw);
//   return {
//     ...rest,
//     children: mappedChildren
//   } as RouteRecordRaw;
// }

const routes: readonly RouteRecordRaw[] = [
  {
    name: "home", 
    component: Home,
    path: "/"
  },
  ...stepperRoutes as RouteRecordRaw[],
  ///...provisionWorkFlowRoutes.map(mapStepperRouterToRaw),
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

]

const router = createRouter({
  routes:[
    {
      name: 'pathResolver',
      component: PathResolver,
      path: '/pathResolver'
    }
  ],
  scrollBehavior() {
    scrollToMainTop();
  },
  history: createWebHistory()
});

export default router;
