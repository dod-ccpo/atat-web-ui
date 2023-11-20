  <template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      
      <h1 class="page-header">Let’s find out about the primary point of contact for this 
        requirement</h1>
      <CommonCorAcor 
        ref="CommonCorAcorRef"
        :isACOR="true" 
        :isWizard="true"
        :currentContactData="currentContactData"
        @update:currentContactData="currentContactData = $event"
        :savedContactData="savedContactData"
        @update:savedContactData="savedContactData = $event"
        showTitle="false"
        isPrimaryContact="true"
      />
    
    </v-container>
  </v-form>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Hook, Vue, toNative } from "vue-facing-decorator";
import CommonCorAcor from "./COR_ACOR/Common.vue";

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
class ContactInfo extends Vue {
 
  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs,
      nextTick: this.$nextTick,
    })
  }

  
  private currentContactData: ContactDTO = AcquisitionPackage.initContact;
  private savedContactData: ContactDTO = AcquisitionPackage.initContact;

  private hasChanged(): boolean {
    return hasChanges(this.currentContactData, this.savedContactData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        this.currentContactData.type = "Primary Contact"
        this.currentContactData.can_access_package = "true"
        await AcquisitionPackage.saveContactInfo({
          data: this.currentContactData,
          type: "Primary Contact",
        });
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }
 

}
export default toNative(ContactInfo)
</script>
