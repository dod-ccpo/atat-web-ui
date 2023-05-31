<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="mb-3">
            Lastly, let’s gather details about your certification POCs
          </h1>
          <p class="copy-max-width mb-8">
            Prior to submitting your completed package to a Contracting Office, your J&A
            will need to be signed by your technical POC and your requirements POC. These
            individuals must have authority to certify that the supporting data, respective
            to their area of expertise, is accurate and complete.
          </p>
          <CertificationPOCTypeForm id="technicalForm"
              POCType="Technical" sequence="1" :save-form.sync="saveTechForm">
          </CertificationPOCTypeForm>
          <hr>
          <CertificationPOCTypeForm id="requirementsForm"
              POCType="Requirements" sequence="2" :save-form.sync="saveReqForm">
          </CertificationPOCTypeForm>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import {Component, Mixins} from "vue-property-decorator";
import CertificationPOCTypeForm
  from "@/steps/02-EvaluationCriteria/MRR/CertificationPOCTypeForm.vue";
import SaveOnLeave from "@/mixins/saveOnLeave";
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({
  components: {
    CertificationPOCTypeForm
  }
})

export default class CertificationPOCs extends Mixins(SaveOnLeave) {
  saveTechForm = false;
  saveReqForm = false;

  /**
   * For child components saveOnLeave is not triggering automatically.
   * This is a workaround to save the state.
   */
  protected async saveOnLeave(): Promise<boolean> {
    await AcquisitionPackage.setValidateNow(true);
    const isValid = this.$refs.form.validate();
    if (isValid) {
      this.saveTechForm = true;
      this.saveReqForm = true;
    }
    return true;
  }
}
</script>
