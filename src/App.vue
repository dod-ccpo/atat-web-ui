<template>
  <v-app>
    <SecurityBanner />
    <ATATSideBar v-if="loginStatus" />
    <RightSideDrawer v-if="loginStatus" />
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
import RightSideDrawer from "@/components/RightSideDrawer.vue";

@Component({
  components: {
    RightSideDrawer,
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
}
</script>
