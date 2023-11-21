import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";
import {stepperRoutes} from "./stepper";
import { provisionWorkFlowRoutes } from "./provisionWorkflow";
import PathResolver from "./resolvers/PathResolver.vue";
import RouteResolver from "./resolvers/RouteResolver.vue";
import Home from "../home/Index.vue";
import { scrollToMainTop } from "@/helpers";
import { StepperRouteConfig } from "types/Global";

const mapStepperRouterToRaw = (route: StepperRouteConfig): RouteRecordRaw => {
  const { menuText, children, ...rest } = route;
  const mappedChildren = children?.map(mapStepperRouterToRaw);
  return {
    ...rest,
    children: mappedChildren
  } as RouteRecordRaw;
}

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
  ...stepperRoutes.map(mapStepperRouterToRaw),
  ...provisionWorkFlowRoutes.map(mapStepperRouterToRaw),
]

const router = createRouter({
  routes,
  scrollBehavior() {
    scrollToMainTop();
  },
  history: createWebHashHistory()
});

stepperRoutes.map(mapStepperRouterToRaw).forEach((route) =>{
  route.children?.forEach((childRoute) =>{
    router.addRoute(route?.name || "", childRoute)
  })
})

export default router;
