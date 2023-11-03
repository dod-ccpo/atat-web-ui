<template>
  <v-form ref="form" lazy-validation>
    <ArchitecturalDesignForm
      :isDOW="true"
      :statementArchitecturalDesign="DOWArchNeeds.statement"
      @update:statementArchitecturalDesign="DOWArchNeeds.statement = $event"
      :applicationsNeedArchitecturalDesign="DOWArchNeeds.applications_needing_design"
      @update:applicationsNeedArchitecturalDesign
        ="DOWArchNeeds.applications_needing_design = $event"
      :dataClassificationsImpactLevels="DOWArchNeeds.data_classification_levels"
      @update:dataClassificationsImpactLevels="DOWArchNeeds.data_classification_levels = $event"
      :externalFactors="DOWArchNeeds.external_factors"
      @update:externalFactors="DOWArchNeeds.external_factors = $event"

    />
  </v-form>
</template>

<script lang="ts">
import { Component, Vue, toNative } from "vue-facing-decorator";

import ArchitecturalDesignForm from "@/components/DOW/ArchitecturalDesignForm.vue"

import AcquisitionPackage from "@/store/acquisitionPackage";
import _ from "lodash";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import DescriptionOfWork, { defaultDOWArchitecturalNeeds } from "@/store/descriptionOfWork";
import { ArchitecturalDesignRequirementDTO } from "@/api/models";
 

@Component({
  mixins: [SaveOnLeave],
  components: {
    ArchitecturalDesignForm
  }
})

class ArchitectureDesignDOW extends Vue {
  public DOWArchNeeds = defaultDOWArchitecturalNeeds;

  /* eslint-disable camelcase */
  public get currentData(): ArchitecturalDesignRequirementDTO {
    return this.DOWArchNeeds
  };

  public savedData: ArchitecturalDesignRequirementDTO = {
    source: "DOW",
    statement: "",
    applications_needing_design: "",
    data_classification_levels: "",
    external_factors: "",
    acquisition_package: AcquisitionPackage.packageId,
    needs_architectural_design_services:""
  }
  /* eslint-enable camelcase */

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await DescriptionOfWork.getDOWArchitecturalNeeds();
    if (storeData) {
      this.DOWArchNeeds = _.cloneDeep(storeData);
      this.savedData = _.cloneDeep(storeData);
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {

    await AcquisitionPackage.setValidateNow(true);

    try {
      if (this.hasChanged()) {
        await DescriptionOfWork.setDOWArchitecturalDesign(this.currentData);
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }  

}
export default toNative(ArchitectureDesignDOW)
</script>
