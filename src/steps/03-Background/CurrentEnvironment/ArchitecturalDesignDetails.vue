<template>
  <form ref="form" lazy-validation>
    <ArchitecturalDesignForm
      :isDOW="false"
      :statementArchitecturalDesign.sync="currEnvDTO.statement_architectural_design"
      :applicationsNeedArchitecturalDesign.sync="currEnvDTO.applications_need_architectural_design"
      :dataClassificationsImpactLevels.sync="currEnvDTO.data_classifications_impact_levels"
      :externalFactors.sync="currEnvDTO.external_factors_architectural_design"
    />
  </form>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";

import ArchitecturalDesignForm from "@/components/DOW/ArchitecturalDesignForm.vue"

import CurrentEnvironment, 
{ defaultCurrentEnvironment } from "@/store/acquisitionPackage/currentEnvironment";
import AcquisitionPackage from "@/store/acquisitionPackage";
import _ from "lodash";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  components: {
    ArchitecturalDesignForm
  }
})

export default class ArchitectureDesignDetails extends Mixins(SaveOnLeave) {
  public currEnvDTO = defaultCurrentEnvironment;

  public get currentData(): Record<string, string | string[]> {
    return {
      statementArchitecturalDesign: this.currEnvDTO.statement_architectural_design,
      applicationsNeedArchitecturalDesign: this.currEnvDTO.applications_need_architectural_design,
      dataClassificationsImpactLevels: this.currEnvDTO.data_classifications_impact_levels,
      externalFactors: this.currEnvDTO.external_factors_architectural_design,
    }
  };

  public savedData: Record<string, string | string[]> = {
    statementArchitecturalDesign: "",
    applicationsNeedArchitecturalDesign: "",
    dataClassificationsImpactLevels: "",
    externalFactors: "",
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await AcquisitionPackage.getCurrentEnvironment();
    if (storeData) {
      this.currEnvDTO = _.cloneDeep(storeData);
      this.savedData = {
        statementArchitecturalDesign: storeData.statement_architectural_design,
        applicationsNeedArchitecturalDesign: storeData.applications_need_architectural_design,
        dataClassificationsImpactLevels: storeData.data_classifications_impact_levels,
        externalFactors: storeData.external_factors_architectural_design,
      }
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {

    AcquisitionPackage.setValidateNow(true);

    try {
      if (this.hasChanged()) {
        // TODO - which store to save to?
        CurrentEnvironment.setCurrentEnvironment(this.currEnvDTO);
        AcquisitionPackage.setCurrentEnvironment(this.currEnvDTO);
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }  

}

</script>
