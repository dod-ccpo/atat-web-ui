<template>
  <div></div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Route } from "vue-router";

// route resolver invoker
import { InvokePathResolver } from "./index";

Component.registerHooks(["beforeRouteEnter"]);
@Component({})
export default class RouteResolver extends Vue {
  private resolveRoute(current: string): void {
    const routeResolver = this.$route.params.resolver;
    const direction = this.$route.params.direction;

    if (!routeResolver) {
      throw new Error("could not obtain step resolver");
    }

    const pathName = InvokePathResolver(routeResolver, current, direction);
    this.$router.push({ path: pathName });
  }

  public async beforeRouteEnter(
    to: Route,
    from: Route,
    next: (n: unknown) => void
  ): Promise<void> {
    next(async (vm: { resolveRoute: (current: string) => void }) => {
      const current = from.name;
      if (!current) {
        throw new Error("from route name undefined");
      }

      vm.resolveRoute(current);
    });
  }
}
</script>
