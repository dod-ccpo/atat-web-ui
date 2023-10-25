<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue, toNative } from "vue-facing-decorator";
import { RouteLocationNormalized, RouterLink } from "vue-router";

// route resolver invoker
import { InvokeRouteResolver } from "./index";

// Component.registerHooks(["beforeRouteEnter"]);
@Component({})
class RouteResolver extends Vue {
  private resolveRoute(current: string): void {
    const routeResolver = this.$route.params.resolver as string;

    if (!routeResolver) {
      throw new Error("could not obtain step resolver");
    }

    const routeName = InvokeRouteResolver(routeResolver, current);
    this.$router.push({ name: routeName });
  }

  public async beforeRouteEnter(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: (n: unknown) => void
  ): Promise<void> {
    next(async (vm: { resolveRoute: (current: string) => void }) => {
      const current = from.name;
      if (!current) {
        throw new Error("from route name undefined");
      }

      vm.resolveRoute(current as string);
    });
  }
}
export default toNative(RouteResolver);
</script>
