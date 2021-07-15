<template>
  <div
    class="
      mt-1
      atat-header-nav
      white--text
      font-weight-bold
      d-flex
      align-center
      justify-space-between
    "
  >
    <div>
      <div class="atat-nav-logo">
        <img
          src="../../public/img/icons/atat-logo.svg"
          width="56"
          class="atat-nav-logo__icon"
        />
      </div>
    </div>
    <div>
      <ATATHeaderNav />
    </div>
  </div>
  <!-- </v-app-bar> -->
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ATATHeaderNav from "../components/ATATHeaderNav.vue";
@Component({
  components: {
    ATATHeaderNav,
  },
})
export default class ATATHeader extends Vue {}
</script>
<style lang="scss">
.atat-header {
  .atat-nav-logo {
    .atat-nav-logo__icon {
      display: inline-block;
      position: relative;
      top: 0.2em;
      margin-right: 0.5rem;
    }
    .atat-header-logo {
      display: inline-block;
      position: relative;
    }
  }
}
</style>
