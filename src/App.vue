<template>
  <v-app>
    <v-system-bar app height="27">
      <SecurityBanner />
    </v-system-bar>
    <!-- class="atat-header-nav -->
    <v-app-bar
      clipped-left
      app
      absolute
      extension-height="100%"
      class="atat-header-nav"
    >
      <!-- <USWDCBanner /> -->
      <ATATHeader />
    </v-app-bar>
    <atat-sidebar v-show="loginStatus" />
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
    <atat-footer />
  </v-app>
</template>

<style lang="scss">
@import "./sass/atat.scss";
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ATATHeader from "./components/ATATHeader.vue";
import USWDCBanner from "./components/USWDCBanner.vue";
import SecurityBanner from "./components/SecurityBanner.vue";

@Component({
  components: {
    ATATHeader,
    USWDCBanner,
    SecurityBanner,
  },
})
export default class App extends Vue {
  get loginStatus(): boolean {
    return this.$store.getters.getLoginStatus;
  }
}
</script>
