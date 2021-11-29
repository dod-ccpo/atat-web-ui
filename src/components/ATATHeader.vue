<template>
  <v-app-bar app clipped-left class="atat-header-nav" height="48">
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
    </div>
  </v-app-bar>
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
