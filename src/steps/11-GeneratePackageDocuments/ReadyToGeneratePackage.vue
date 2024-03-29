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
              <ul class="_atat-ul">
                <li class="mb-5">
                  We’ll use the information that you provided to generate your required 
                  documents for this acquisition package. This process will take a few minutes.
                </li>
                <li class="mb-5">
                  Once complete, you’ll be able to download and review your package. If needed, 
                  you can make edits within the wizard and re-generate your package documents.
                </li>
                <li v-show="contractingShop === 'DITCO'">
                  Prior to submitting your package to Defense Information Technology Contracting
                  Organization (DITCO), you must obtain signatures and upload any documents
                  requiring certification.
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
import { Component, Hook, Vue, toNative } from "vue-facing-decorator";
import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";
import AcquisitionPackage from "@/store/acquisitionPackage";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { SaveOnLeaveRefs } from "types/Global";

@Component({
  components: {
    ATATSVGIcon
  }
})
class ReadyToGeneratePackage extends Vue {

    
  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs, 
      nextTick: this.$nextTick,
    }).catch()
  }
  
  get contractingShop():string {
    return AcquisitionPackage.contractingShop
  }

  public async saveOnLeave(): Promise<boolean> {
    await AcquisitionPackage.setValidateNow(true);
    return true;
  }
}

export default toNative(ReadyToGeneratePackage)
</script>
