<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue, toNative, Hook } from "vue-facing-decorator";
import { RouteLocationNormalized } from "vue-router";

// route resolver invoker
import { InvokePathResolver } from "./index";

// Component.registerHooks(["beforeRouteEnter"]);
@Component({})
class RouteResolver extends Vue {
  private resolveRoute(current: string): void {
    const routeResolver = this.$route.query.resolver as string;
    const direction = this.$route.query.direction as string;

    if (!routeResolver) {
      throw new Error("could not obtain step resolver");
    }

    const pathName = InvokePathResolver(routeResolver, current, direction);
    this.$router.push({ path: pathName });
  }
  @Hook
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
export default toNative(RouteResolver)
</script>
