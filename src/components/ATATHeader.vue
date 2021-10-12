<template>
  <v-app-bar
    app
    clipped-left
    :class="[show ? 'expandedHeader' : 'condensedHeader']"
    class="atat-header-nav"
  >
    <template v-slot:extension>
      <USAGovBanner @toggle="toggle" />
      <div class="d-flex align-center justify-space-between pt-2 nav-header">
        <div class="d-flex align-center px-4">
          <img
            src="../../public/img/icons/atat-logo.svg"
            width="56"
            alt="ATAT logo"
            class="atat-nav-logo__icon"
          />
        </div>
        <ATATHeaderNav />
        <v-progress-linear
          class="mt-12"
          :active="$store.state.setIsProgressBarDisplayed"
          :indeterminate="true"
          fixed
          height="10"
          color="bg-primary-vivid"
          background-opacity="0"
        ></v-progress-linear>
      </div>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ATATHeaderNav from "../components/ATATHeaderNav.vue";
import USAGovBanner from "../components/USAGovBanner.vue";

@Component({
  components: {
    ATATHeaderNav,
    USAGovBanner,
  },
})
export default class ATATHeader extends Vue {
  public show = false;

  public toggle(toggle: boolean): void {
    this.show = toggle;
  }
}
</script>
