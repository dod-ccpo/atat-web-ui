<template>
  <v-form ref="form" lazy-validation>
    <div class="mb-7">
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="page-header">
              Ready to generate your acquisition package?
            </h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="col-6">
            <h2>
              <strong>In this section:</strong>
            </h2>
            <br/>
            <span class="mt-2 mb-0">
              <ul>
                <li>
                  We’ll use the information that you provided to generate your required 
                  documents for this acquisition package. This process will take a few minutes.
                  <br/><br/>
                </li>
                <li>
                  Once complete, you’ll be able to download and review your package. If needed, 
                  you can make edits within the wizard and re-generate your package documents.
                </li>
              </ul>
            </span>
          </v-col>
          <v-col class="col-6">
            <ATATSVGIcon
              width="500"
              height="375.52"
              name="readyToGeneratePackage"
            ></ATATSVGIcon>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-form>
</template>
<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins, Watch } from "vue-property-decorator";
import SaveOnLeave from "@/mixins/saveOnLeave";
import AcquisitionPackage from "@/store/acquisitionPackage";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

@Component({
  components: {
    ATATSVGIcon
  }
})
export default class ReadyToGeneratePackage extends Mixins(SaveOnLeave) {

  // public async mounted(): Promise<void> {
  // }

  public async saveOnLeave(): Promise<boolean> {
    await AcquisitionPackage.setValidateNow(true);
    return true;
  }
}
</script>