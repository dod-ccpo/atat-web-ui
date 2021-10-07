<template>
  <v-app>
    <SecurityBanner />
    <ATATSideBar v-if="loginStatus && getIsNavSideBarDisplayed" />
    <SideDrawer v-if="loginStatus" />
    <ATATHeader />
    <v-main style="padding-top: 90px">
      <v-container fluid>
        <router-view> </router-view>
      </v-container>
    </v-main>
    <ATATFooter />
    <ATATDialog />
  </v-app>
</template>

<style lang="scss">
@import "./sass/atat.scss";
</style>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import ATATFooter from "./components/ATATFooter.vue";
import ATATHeader from "./components/ATATHeader.vue";
import ATATSideBar from "./components/ATATSideBar.vue";
import SecurityBanner from "./components/SecurityBanner.vue";
import SideDrawer from "@/components/SideDrawer.vue";
import ATATDialog from "@/components/ATATDialog.vue";
import { Route } from "vue-router";

@Component({
  components: {
    SideDrawer,
    ATATFooter,
    ATATHeader,
    ATATSideBar,
    ATATDialog,
    SecurityBanner,
  },
})
export default class App extends Vue {
  get loginStatus(): boolean {
    return this.$store.getters.getLoginStatus;
  }

  @Watch("$route", { immediate: true, deep: true })
  onUrlChange(newVal: Route): void {
    this.$store.dispatch("displayNavSideBarDisplayed", newVal.name);
  }

  get getIsNavSideBarDisplayed(): boolean {
    return this.$store.getters.getIsNavSideBarDisplayed;
  }
}
</script>
