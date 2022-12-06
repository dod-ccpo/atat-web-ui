<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Do you require any specific training courses from your contractors?
          </h1>
          <div class="copy-max-width">
            <p class="mb-10">
              Contractor employees may be required to take periodic mandatory training courses
              provided through the agency, such as records management training and other training
              required by statute, regulation, DoD, or local (e.g. DISA) policy. If your project
              requires specific training, we’ll gather details about these courses next.
            </p>
            <ATATRadioGroup
              class="copy-max-width mb-10 max-width-740"
              id="TrainingOptions"
              :card="true"
              :items="trainingOptions"
              :value.sync="selectedOption"
              :rules="[$validators.required('Please select an option')]"
              width="180"

            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins } from "vue-property-decorator";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue"
import { RadioButton } from "../../../types/Global";
import { ContractConsiderationsDTO } from "@/api/models";
import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATRadioGroup,
  },
})

export default class Training extends Mixins(SaveOnLeave) {
  private savedData: ContractConsiderationsDTO = {};
  private selectedOption 
    = AcquisitionPackage.contractConsiderations?.contractor_required_training || "";
  private trainingCourses = "";

  private trainingOptions: RadioButton[] = [
    {
      id: "Yes",
      label: "Yes.",
      value: "YES",
    },
    {
      id: "No",
      label: "No.",
      value: "NO",
    },
  ];

  public get currentData(): ContractConsiderationsDTO {
    return {
      contractor_required_training: this.selectedOption,
      required_training_courses: this.trainingCourses,
    };
  }
  public async loadOnEnter(): Promise<void> {
    const storeData = await AcquisitionPackage.loadData<ContractConsiderationsDTO>({
      storeProperty: StoreProperties.ContractConsiderations
    });    
    if (storeData) {
      this.savedData = {
        contractor_required_training: storeData.contractor_required_training,
        required_training_courses: storeData.required_training_courses,
      }
    }
  }

  public isChanged(): boolean {
    return hasChanges(this.savedData, this.currentData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.isChanged()) {
        if (this.currentData.contractor_required_training === "NO") {
          this.trainingCourses = "";
        }
        await AcquisitionPackage.saveData({
          data: this.currentData,
          storeProperty: StoreProperties.ContractConsiderations,
        });
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();

  }

}
</script>
