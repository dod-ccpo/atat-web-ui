<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header">
            Let’s gather info about your Contracting Officer’s Representative (COR)
          </h1>
          <p class="page-intro">
            Your COR is an important part of your acquisition
            approval process. We will fill out your COR’s contact information on any necessary forms
            and will send your COR an email when documents are ready to be signed. Search for your
            COR below or manually enter their contact information. 
            For more guidance about CORs, visit
            <a 
              href="https://www.ditco.disa.mil/hq/cor/" 
              class="_text-link" 
              target="_blank"
              rel="noopener"
            >
              DITCO's COR Resources<span class="_external-link">.</span>
            </a>
          </p>

          <CommonCorAcor 
            ref="CommonCorAcorRef"
            :isACOR="false"
            :isWizard="true"
            :currentContactData="currentContactData"
            @update:currentContactData="currentContactData = $event"
            :savedContactData="savedContactData"
            @update:savedContactData="savedContactData = $event"
          />

        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Hook, Vue, toNative } from "vue-facing-decorator";
import CommonCorAcor from "./Common.vue";

import AcquisitionPackage from "@/store/acquisitionPackage";
import { ContactDTO } from "@/api/models";
import { hasChanges } from "@/helpers";
import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";
import { SaveOnLeaveRefs } from "types/Global";
 

@Component({
  components: {
    CommonCorAcor,
  }
})

class CorInfo extends Vue {

  
  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs,
      nextTick: this.$nextTick,
    }).catch()
  }

  private currentContactData: ContactDTO = AcquisitionPackage.initContact;
  private savedContactData: ContactDTO = AcquisitionPackage.initContact;

  private hasChanged(): boolean {
    return hasChanges(this.currentContactData, this.savedContactData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.saveContactInfo(
          { data: this.currentContactData, type: "COR" }
        );
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }


}

export default toNative(CorInfo)
</script>
