<template>
  <div class="_panel-padding">
    <h2 class="mb-5">
      Understanding Periods of Performance (PoP) for task orders on the JWCC contract
    </h2>
    <p> 
      A requested PoP should be from the date of award through XX years/months/days 
      after date of award, with XX option periods (e.g. one-year base period with 
      four one-year option periods).
    </p>
    <p>
      The following guidelines should be used when determining the PoP for task orders 
      on the JWCC contract:
    </p>
    <ul>
      <li>
        A single base and/or option period cannot exceed one year.
      </li>
      <li>
        The PoP, including the base and all option periods, cannot exceed five years.
      </li>
      <li>
        A task order cannot extend more than one year after the expiration date of 
        the JWCC contract. However, option periods may be exercised after the 
        expiration date.
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
          In the event that a JWCC contract option period is not exercised or is 
          terminated/canceled prior to the end of the last anticipated option period 
          in the JWCC contract schedule, any current task orders’ terms and conditions 
          will be unaffected.
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
