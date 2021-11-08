<template>
  <v-app>
    <ATATHeader />
    <ATATSideBar v-if="loginStatus && getIsNavSideBarDisplayed" />
    <v-main style="padding-top: 100px">
      <router-view> </router-view>
    </v-main>
    <SideDrawer v-if="loginStatus" />
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
import SideDrawer from "@/components/SideDrawer.vue";
import { Route } from "vue-router";

@Component({
  components: {
    ATATDialog,
    ATATFooter,
    ATATHeader,
    ATATSideBar,
    ATATToast,
    SideDrawer,
  },
})
export default class App extends Vue {
  private isDialogDisplayed = false;

  get loginStatus(): boolean {
    //todo: remove `|| window.location.protocol === "http:"` as it a temp fix
    //to help QA login without 'https' and for the side bar to appear.
    return (
      this.$store.getters.getLoginStatus || window.location.protocol === "http:"
    );
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
    this.focusH1();
  }

  public async updated(): Promise<void> {
    this.focusH1();
  }

  public focusH1(): void {
    // for 508 compliance in SPA, focus on first h1 of a new "page"
    const h1 = document.getElementsByTagName("h1");
    if (h1.length) {
      h1[0].focus();
    }
  }
}
</script>
