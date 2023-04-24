<template>
  <div class="_panel-padding">
    <h2 class="mb-5">
      Understanding Periods of Performance (PoP) for task orders on the JWCC Contract
    </h2>
   <p> 
      Each task order issued under the JWCC Contract must specify the duration of the 
      base period, as well as any subsequent option periods (e.g., one-year base period with 
      four one-year option periods). The actual PoP start date will be based on the task order’s 
      execution date or on a requested start date, if applicable. The PoP end date will be the 
      last day of the base period or the final exercised option period.

    </p>
    <p>
      Use the following guidelines when determining your task order PoP:
    </p>
    <ul>
      <li>
        A single base and/or option period cannot exceed one calendar year.
      </li>
      <li>
        The PoP, including the base period and all option periods, 
        cannot exceed five calendar years.
      </li>
      <li>
        A task order cannot extend more than one calendar year after the expiration date of 
        the JWCC Contract. Option periods may be exercised after the JWCC Contract expires, 
        but the final option period cannot exceed one calendar year after the expiration.
      </li>
    </ul>
    <ATATAlert
      id="PoPLearnMoreAlert"
      type="info"
      :showIcon="true"
      class="mt-5"
    >
      <template v-slot:content>
        <p class="mb-0">
          In the event that an option period on the JWCC Contract is not exercised or is 
          terminated/canceled prior to the end of the last anticipated option period, 
          any current task orders’ terms and conditions will be unaffected.
        </p>
      </template>
    </ATATAlert>

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATAlert from "@/components/ATATAlert.vue";

@Component({
  components: {
    ATATAlert
  }
})
export default class PopLearnMore extends Vue {}
</script>
