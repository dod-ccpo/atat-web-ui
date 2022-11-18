<template>
  <v-form ref="form">
    <v-container class="container-max-width" fluid>
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Tell us more about your requirements to replicate your environment
          </h1>
          <div class="copy-max-width">
            <p id="IntroP" class="mb-6">
              Use vendor-neutral language in your responses. This will be added 
              to your Description of Work, so avoid including any company names 
              or vendor-unique brand, product, or titles that could impact full 
              and open competition.
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";

import { RadioButton } from "types/Global";
import CurrentEnvironment, 
{ defaultCurrentEnvironment } from "@/store/acquisitionPackage/currentEnvironment";
import AcquisitionPackage from "@/store/acquisitionPackage";
import _ from "lodash";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATRadioGroup,
    ATATTextArea,
  }
})

export default class ReplicateDetails extends Mixins(SaveOnLeave) {


}
</script>

