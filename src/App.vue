<template>
  <v-app>
    <SecurityBanner />
    <ATATSideBar v-if="loginStatus && getIsNavSideBarDisplayed" />
    <SideDrawer  v-if="loginStatus" />
    <ATATHeader />
    <v-main style="padding-top: 90px">
      <v-container fluid>
        <router-view> </router-view>
      </v-container>
    </v-main>
    <ATATFooter />
  </v-app>
</template>

<style lang="scss">
@import "./sass/atat.scss";
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ATATFooter from "./components/ATATFooter.vue";
import ATATHeader from "./components/ATATHeader.vue";
import ATATSideBar from "./components/ATATSideBar.vue";
import SecurityBanner from "./components/SecurityBanner.vue";
import SideDrawer from "@/components/SideDrawer.vue";

@Component({
  components: {
    SideDrawer,
    ATATFooter,
    ATATHeader,
    ATATSideBar,
    SecurityBanner,
  },
})
export default class App extends Vue {
  get loginStatus(): boolean {
    return this.$store.getters.getLoginStatus;
  }

  get getIsNavSideBarDisplayed(): boolean {
    return this.$store.getters.getIsNavSideBarDisplayed(this.$route.name);
  }
}
</script>
