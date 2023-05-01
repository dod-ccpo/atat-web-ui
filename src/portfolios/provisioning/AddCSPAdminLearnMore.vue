<template>
  <div class="_panel-padding">
    <h2 class="mb-5">
      Understanding the CSP administrator role
    </h2>
    <CSPAdminLearnMoreText />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import CSPAdminLearnMoreText from "./AddCSPAdminLearnMoreText.vue"

@Component({
  components: {
    CSPAdminLearnMoreText
  }
})

export default class CSPAdminLearnMore extends Vue {}
</script>
