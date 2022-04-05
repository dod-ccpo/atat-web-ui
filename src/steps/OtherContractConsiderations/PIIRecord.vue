<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Tell us more about your system of records
          </h1>
          <div class="mt-10">
            <ATATTextField
              id="SystemName"
              label="System name"
              class="_input-max-width"
            />
          </div>
          <div class="d-flex align-start flex-column mt-10 textarea-max-width">
            <ATATTextArea
              id="OperationToBePerformed"
              label="What is the operation of work to be performed?"
              class="width-100"
              :rows="7"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component} from "vue-property-decorator";

import ATATTextArea from "@/components/ATATTextArea.vue";
import ATATTextField from "@/components/ATATTextField.vue";

@Component({
  components: {
    ATATTextArea,
    ATATTextField,
  },
})

export default class PIIRecord extends Vue {
  private systemName = "";
  private operationToBePerformed = "";
}
</script>
