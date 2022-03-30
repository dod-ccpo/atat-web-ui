
<template>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Let’s gather some details about your current contract
          </h1>
          <div class="copy-max-width">
  
            <ATATTextField 
              label="Incumbent contractor name" 
              id="IncumbentContractorName" 
              class="input-max-width mb-10" 
            />

            <ATATTextField 
              label="Contract number" 
              id="ContractNumber" 
              class="input-max-width mb-10" 
            />
            
            <ATATTextField 
              label="Task/Delivery order number" 
              id="TaskDeliveryOrderNumber" 
              class="input-max-width mb-10" 
            />

            <ATATDatePicker id="Expiration" 
              label="Contract/Order expiration date"
              placeHolder="MM/DD/YYYY"
              :value.sync="expiredDate" 
              :rules="[
                $validators.required('Please enter a valid date'),
                $validators.isDateValid('Please enter a valid date')
              ]" />

          </div>
        </v-col>
      </v-row>
    </v-container>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import ATATDatePicker from "@/components/ATATDatePicker.vue";
import ATATTextField from "@/components/ATATTextField.vue";

@Component({
  components: {
    ATATDatePicker,
    ATATTextField,
  },
})
export default class CurrentContractDetails extends Vue {
  private expiredDate="";

}
</script>

