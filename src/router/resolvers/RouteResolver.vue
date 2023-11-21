<template>
  <div></div>
</template>

<script lang="ts">
import AppSections from "@/store/appSections";
import { Component, Hook, Vue, toNative } from "vue-facing-decorator";
import { RouteLocationNormalized } from "vue-router";

// route resolver invoker
import { InvokeRouteResolver } from "./index";
import { InvokeATATRouteResolver } from "../provisionWorkflow";

@Component({})
class RouteResolver extends Vue {
  private async resolveRoute(current: string): Promise<void> {
    const routeResolver = this.$route.query.resolver as string;

    if (!routeResolver) {
      throw new Error("could not obtain step resolver");
    }

    const appSectionData = await AppSections.getSectionData();
    let routeName = "";
    if (appSectionData.activeSection === appSectionData.sectionTitles.AcquisitionPackage) {
      routeName = InvokeRouteResolver(routeResolver, current);
    } else if (appSectionData.activeSection === appSectionData.sectionTitles.ProvisionWorkflow) {
      routeName = InvokeATATRouteResolver(routeResolver, current)
    }
    
    this.$router.push({ name: routeName });
  }

  @Hook
  public async beforeRouteEnter(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: (n: unknown) => void
  ): Promise<void> {
    next(async (vm: { resolveRoute: (current: string) => Promise<void>}) => {
      const current = from.name;
      if (!current) {
        throw new Error("from route name undefined");
      }

      await vm.resolveRoute(current as string);
    });
  }
}
export default toNative(RouteResolver)
</script>
