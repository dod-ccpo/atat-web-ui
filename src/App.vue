<template>
  <v-app>
    <SecurityBanner />
    <ATATSideBar v-if="loginStatus && getIsNavSideBarDisplayed" />
    <SideDrawer v-if="loginStatus" />
    <ATATHeader />
    <v-main style="padding-top: 90px">
      <v-container fluid class="pr-0 pt-0">
        <router-view> </router-view>
      </v-container>
    </v-main>
    <ATATFooter />
    <ATATDialog v-show="isDialogDisplayed" />
    <ATATToast />
  </v-app>
</template>

<style lang="scss">
@import "./sass/atat.scss";
</style>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import ATATDialog from "@/components/ATATDialog.vue";
import ATATFooter from "./components/ATATFooter.vue";
import ATATHeader from "./components/ATATHeader.vue";
import ATATSideBar from "./components/ATATSideBar.vue";
import ATATToast from "@/components/ATATToast.vue";
import SecurityBanner from "./components/SecurityBanner.vue";
import SideDrawer from "@/components/SideDrawer.vue";
import { Route } from "vue-router";

@Component({
  components: {
    ATATDialog,
    ATATFooter,
    ATATHeader,
    ATATSideBar,
    ATATToast,
    SecurityBanner,
    SideDrawer,
  },
})
export default class App extends Vue {
  private isDialogDisplayed = false;

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

  @Watch("$store.state.dialog.isDisplayed")
  onDialogDisplayedChange(newVal: boolean): void {
    this.isDialogDisplayed = newVal;
  }

  public mounted(): void {
    this.$store.dispatch("initDialog");
  }
}
</script>
