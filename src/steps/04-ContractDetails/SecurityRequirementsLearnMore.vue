<template>
  <div class="_panel-padding">
    <h2 class="mb-5">
      About JWCC security requirements
    </h2>
    <p>
    Security requirements and compliance mandates are established in the JWCC Contract DD Form 
    254, DoD Contract Security Classification Specification. This covers access to all 
    classification levels for the task orders ordered within it.
    </p>
    <p>
      As a result, Mission Owners that have Secret and/or Top Secret classification requirements 
      do not need to complete a DD Form 254 for their individual task order.
    </p>
    <p>
      Security requirements pertaining to contractor employee’s clearance levels and access to 
      classified information will be captured within the Description of Work for each task order.
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})

export default class SecurityRequirementsLearnMore extends Vue {}
</script>
