<template>
  <v-form ref="form" lazy-validation>
    <div class="mb-7">
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="page-header">
              Last step! Your completed package requires additional documentation.
            </h1>
            <div class="copy-max-width">
              <p class="mt-2 mb-0">
                Based on what you told us about your exception to fair opportunity in Step 2, 
                you need to complete a 
                <strong>
                    Justification &amp; Approval (J&amp;A) 
                    and Sole Source Market Research Report (MRR).
                </strong>
              </p>
              <br/><br/>
              <div class="bg-primary-lighter border-rounded-more pa-8">
                <h2>
                  <strong>What do I need to do?</strong>
                </h2>
                <br/>
                <v-list class="_atat-stepper">
                  <v-list-item-group >
                    <v-list-item>
                      <span class="_step-circle">1</span>
                      <v-list-item-content>
                        <span class="">
                          Download Word templates for the J&amp;A and MRR below.<br/><br/>
                          <v-row>
                            <v-col cols="4">
                              <v-btn
                                class="v-btn primary"
                                role="button"
                                @click="downloadTemplateForms('ja')"
                              >
                                Download J&amp;A Template &nbsp;
                                <v-icon class="v-btn--icon">download</v-icon>
                              </v-btn>
                            </v-col>
                            <v-col cols="8">
                              <v-btn
                                class="v-btn primary ml-4"
                                role="button"
                                @click="downloadTemplateForms('mrr')"
                              >
                                Download MRR Template &nbsp;
                                <v-icon class="v-btn--icon">download</v-icon>
                              </v-btn>
                            </v-col>
                          </v-row>
                        </span>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <span class="_step-circle">2</span>
                      <v-list-item-content>
                        Follow the instructions provided within each template to complete the 
                        documents outside of DAPPS. Be sure to obtain any necessary signatures.
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <span class="_step-circle">3</span>
                      <v-list-item-content>
                        Upload your signed J&amp;A and MRR below, and we will include them within 
                        your completed requirements package that will be generated next.
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </div>
            </div>
            <hr />
            <div class="copy-max-width">
              
            </div>
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
import ATATFileUpload from "@/components/ATATFileUpload.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({
  components: {
    ATATFileUpload
  },
})
export default class UploadJAMRRDocuments extends Mixins(SaveOnLeave) {

  protected async saveOnLeave(): Promise<boolean> {

    AcquisitionPackage.setValidateNow(true);

    return true;
  }

  private async downloadTemplateForms(type: string): Promise<void> {
    console.log("Waiting for links");
  }
}
</script>