import { Vue, Component, toNative } from "vue-facing-decorator";
import { RouteLocationNormalized } from "vue-router";
import Steps from "@/store/steps";

/**
 * Defines a mixable that calls loadOnEnter method for any 
 * component that extends this mixin. 
 */
// Component.registerHooks(["beforeRouteEnter"]);
@Component({})
class LoadOnEnter extends Vue {

  public async beforeRouteEnter(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: (n: unknown) => void
  ): Promise<void> {
    // Steps.setEnterStepComplete(to.name as string);
    next(async (vm: {loadOnEnter: ()=> Promise<void>} ) => {
      await vm.loadOnEnter();
    });
  }

}

export default LoadOnEnter
