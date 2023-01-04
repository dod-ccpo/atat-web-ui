<template>
  <v-form ref="form" lazy-validation>
    <ArchitecturalDesignForm
      :isDOW="false"
      :statementArchitecturalDesign.sync="CurrentEnvironmentArchNeeds.statement"
      :applicationsNeedArchitecturalDesign.sync="
        CurrentEnvironmentArchNeeds.applications_needing_design"
      :dataClassificationsImpactLevels.sync="CurrentEnvironmentArchNeeds.data_classification_levels"
      :externalFactors.sync="CurrentEnvironmentArchNeeds.external_factors"
    />
  </v-form>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";

import ArchitecturalDesignForm from "@/components/DOW/ArchitecturalDesignForm.vue"

import AcquisitionPackage from "@/store/acquisitionPackage";
import _ from "lodash";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import CurrentEnvironment, 
{ 
  defaultCurrentEnvironment, 
  defaultCurrentEnvironmentArchitecturalNeeds 
} from "@/store/acquisitionPackage/currentEnvironment";
import { ArchitecturalDesignRequirementDTO } from "@/api/models";

@Component({
  components: {
    ArchitecturalDesignForm
  }
})

export default class ArchitectureDesign extends Mixins(SaveOnLeave) {
  public CurrentEnvironmentArchNeeds = defaultCurrentEnvironmentArchitecturalNeeds;

  /* eslint-disable camelcase */
  public get currentData(): ArchitecturalDesignRequirementDTO {
    return {
      source: "CURRENT_ENVIRONMENT",
      statement: this.CurrentEnvironmentArchNeeds.statement,
      applications_needing_design: this.CurrentEnvironmentArchNeeds.applications_needing_design,
      data_classification_levels: this.CurrentEnvironmentArchNeeds.data_classification_levels,
      external_factors: this.CurrentEnvironmentArchNeeds.external_factors,
      acquisition_package: this.CurrentEnvironmentArchNeeds.acquisition_package
    }
  };

  public savedData: ArchitecturalDesignRequirementDTO = {
    source: "CURRENT_ENVIRONMENT",
    statement: "",
    applications_needing_design: "",
    data_classification_levels: "",
    external_factors: "",
    acquisition_package: ""
  }
  /* eslint-enable camelcase */

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await CurrentEnvironment.getCurrentEnvironmentArchitecturalNeeds();
    if (storeData) {
      this.CurrentEnvironmentArchNeeds = _.cloneDeep(storeData);
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
        CurrentEnvironment.setCurrentEnvironmentArchitecturalDesign(this.currentData);

      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }  

}

</script>
