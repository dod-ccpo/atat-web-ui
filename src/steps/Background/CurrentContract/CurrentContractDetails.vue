
<template>
  <div>
    <h2>Current Contract Details</h2>
    <ATATDatePicker id="Expiration" 
      label="Contract/Order Expiration Date"
      placeHolder="MM/DD/YYYY"
      :date.sync="expiredDate" 
      :rules="[
        $validators.required('Please enter a valid date'),
        $validators.isDateValid('Please enter a valid date 002')
      ]" />
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
export default class CurrentContractDetails extends Vue {
  private expiredDate="";

}
</script>

