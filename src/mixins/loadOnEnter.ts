import Vue from "vue";
import { Route } from "vue-router";
import { Component } from "vue-property-decorator";
import Steps from "@/store/steps";

/**
 * Defines a mixable that calls loadOnEnter method for any 
 * component that extends this mixin. 
 */
Component.registerHooks(["beforeRouteEnter"]);
@Component({})
export default class LoadOnEnter extends Vue {

  public async beforeRouteEnter(
    to: Route,
    from: Route,
    next: (n: unknown) => void
  ): Promise<void> {
    Steps.setEnterStepComplete(to.name as string);
    next(async (vm: {loadOnEnter: ()=> Promise<void>} ) => {
      await vm.loadOnEnter();
    });
  }

}
