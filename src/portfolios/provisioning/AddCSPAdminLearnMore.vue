<template>
  <div class="_panel-padding">
    <h2 class="mb-5">
      Understanding the CSP administrator role
    </h2>
    <CSPAdminLearnMoreText />
  </div>
</template>

<script lang="ts">
import { Component, Vue, toNative } from "vue-facing-decorator";

import CSPAdminLearnMoreText from "./AddCSPAdminLearnMoreText.vue"

@Component({
  components: {
    CSPAdminLearnMoreText
  }
})

class CSPAdminLearnMore extends Vue {}
export default CSPAdminLearnMore
</script>
