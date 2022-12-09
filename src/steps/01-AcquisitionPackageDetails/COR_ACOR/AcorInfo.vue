<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header">
            Let’s gather info about your ACOR
          </h1>
          <p class="page-intro">
            Your ACOR’s information will be used to fill out any forms in your 
            acquisition package. We will send this individual an email if their 
            signature is required on any documents. Search for your ACOR below or 
            manually enter their contact information. For more guidance about 
            CORs, visit 
            <a 
              href="https://www.ditco.disa.mil/hq/cor/index.asp" 
              class="_text-link" 
              target="_blank"
              rel="noopener"
            >
              DITCO's COR Resources<span class="_external-link">.</span>
            </a>
          </p>

          <CommonCorAcor 
            :isACOR="true" 
            :isWizard="true"
            :currentContactData.sync="currentContactData"
            :savedContactData.sync="savedContactData"
          />

        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import CommonCorAcor from "./Common.vue";

import AcquisitionPackage from "@/store/acquisitionPackage";
import { ContactDTO } from "@/api/models";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  components: {
    CommonCorAcor,
  }
})

export default class CorInfo extends Mixins(SaveOnLeave) {
  private currentContactData: ContactDTO = AcquisitionPackage.initContact;
  private savedContactData: ContactDTO = AcquisitionPackage.initContact;

  private hasChanged(): boolean {
    return hasChanges(this.currentContactData, this.savedContactData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.saveContactInfo(
          { data: this.currentContactData, type: "ACOR" }
        );
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }

}

</script>
