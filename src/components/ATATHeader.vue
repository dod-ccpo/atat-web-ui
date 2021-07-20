<template>
  <v-app-bar
    app
    clipped-left
    :class="[show ? 'expandedHeader' : 'condensedHeader']"
    class="atat-header-nav py-2"
  >
    <template v-slot:extension>
      <USAGovBanner @toggle="toggle" />
      <div class="d-flex align-center justify-space-between pt-1">
        <div class="d-flex align-center px-4">
          <img
            src="../../public/img/icons/atat-logo.svg"
            width="56"
            class="atat-nav-logo__icon"
          />
        </div>
        <ATATHeaderNav />
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

  public toggle(toggle: boolean) {
    this.show = toggle;
  }
}
</script>

<style lang="scss">
.expandedHeader {
  height: 183px !important;
}

.condensedHeader {
  height: 65px !important;
}

.usa-gov {
  height: 20px !important;
  background-color: lightgray !important;
}

// .atat-header {
//   .atat-nav-logo {
//     .atat-nav-logo__icon {
//       display: inline-block;
//       position: relative;
//       top: 0.2em;
//       margin-right: 0.5rem;
//     }
//     .atat-header-logo {
//       display: inline-block;
//       position: relative;
//     }
//   }
// }
</style>
