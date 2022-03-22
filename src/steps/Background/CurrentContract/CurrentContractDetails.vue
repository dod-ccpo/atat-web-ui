
<template>
  <div>
    <h2>Current Contract Details</h2>
    <ATATDatePicker id="Expiration" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import ATATDatePicker from "@/components/ATATDatePicker.vue";

@Component({
  components: {
    ATATDatePicker,
  },
})
export default class CurrentContractDetails extends Vue {}
</script>

