<template>
  <v-form ref="form" lazy-validation>
    <div class="mb-7">
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="page-header">
              Let’s gather requirements for your architectural design solution
            </h1>
            <p v-if="classificationLabel">
              This architectural design solution will be for the
              <span class="font-weight-500">
                {{ classificationLabel }}
              </span>
              classification level. If you need a different level,
              <a
                role="button"
                id="UpdateClassification"
                tabindex="0"
                @click="openModal"
                @keydown.enter="openModal"
                @keydown.space="openModal"
              >update your Classification Requirements</a>.
            </p>
            <div>
              <ATATCheckboxGroup
                id="ClassificationLevelCheckboxes"
                ref="ClassificationLevelCheckboxesRef"
                :value="selectedClassifications"
                @update:value="selectedClassifications = $event"
                :items="classificationCheckboxes"
                groupLabel="What classification and impact level do you need an
                  architectural design solution for?"
                name="checkboxes"
                :card="false"
                class="copy-max-width"
                :rules="[
                  $validators.required('Please select at least one classification level.')
                ]"
              />
              <a
                role="button"
                id="UpdateClassification"
                tabindex="0"
                @click="openModal"
                @keydown.enter="openModal"
                @keydown.space="openModal"
              >update your Classification Requirements</a>.
            </div>
            <hr />
            <ArchitecturalDesignForm
              ref="ArchitecturalDesignFormRef"
              :isDOW="true"
              :statementArchitecturalDesign="DOWArchNeeds.statement"
              @update:statementArchitecturalDesign="DOWArchNeeds.statement = $event"
              :applicationsNeedArchitecturalDesign="DOWArchNeeds.applications_needing_design"
              @update:applicationsNeedArchitecturalDesign
                ="DOWArchNeeds.applications_needing_design = $event"
              :dataClassificationsImpactLevels="DOWArchNeeds.data_classification_levels"
              @update:dataClassificationsImpactLevels
                ="DOWArchNeeds.data_classification_levels = $event"
              :externalFactors="DOWArchNeeds.external_factors"
              @update:externalFactors="DOWArchNeeds.external_factors = $event"
            />
            <ClassificationsModal
              :showDialog="showDialog"
              @cancelClicked="modalCancelClicked"
              @okClicked="modalOkClicked"
              :modalSelectedOptions="modalSelectedOptions"
              @update:modalSelectedOptions="modalSelectedOptions = $event"
              :modalSelectionsOnOpen="modalSelectionsOnOpen"
              :modalCheckboxItems="modalCheckboxItems"
              :IL6SysId="IL6SysId"
              :isIL6Selected="isIL6Selected"
              @update:isIL6Selected="isIL6Selected = $event"
            />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-form>
</template>

<script lang="ts">
import { Component, Hook, Vue, toNative } from "vue-facing-decorator";

import ArchitecturalDesignForm from "@/components/DOW/ArchitecturalDesignForm.vue"

import AcquisitionPackage from "@/store/acquisitionPackage";
import _ from "lodash";
import { buildClassificationCheckboxList, buildClassificationLabel, hasChanges } from "@/helpers";
import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";
import DescriptionOfWork, { defaultDOWArchitecturalNeeds } from "@/store/descriptionOfWork";
import {
  ArchitecturalDesignRequirementDTO,
  ClassificationLevelDTO,
  SelectedClassificationLevelDTO
} from "@/api/models";
import { Checkbox, SaveOnLeaveRefs } from "types/Global";
import classificationRequirements from "@/store/classificationRequirements";
import {
  buildCurrentSelectedClassLevelList
} from "@/packages/helpers/ClassificationRequirementsHelper";
import ClassificationRequirements from "@/store/classificationRequirements";
import { convertColumnReferencesToValues } from "@/api/helpers";
import ClassificationsModal from "@/steps/05-PerformanceRequirements/DOW/ClassificationsModal.vue";
 

@Component({
  components: {
    ArchitecturalDesignForm,
    ClassificationsModal
  }
})

class ArchitectureDesignDOW extends Vue {

  
  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs, 
      nextTick: this.$nextTick,
    }).catch()
  }

  public DOWArchNeeds = defaultDOWArchitecturalNeeds;
  public selectedClassificationLevelList: SelectedClassificationLevelDTO[] = [];
  public classificationCheckboxes: Checkbox[] = [];
  public classificationLabel = "";
  public selectedClassifications = [];
  public allClassificationLevels:ClassificationLevelDTO[] = [];
  private showDialog = false;
  public modalSelectionsOnOpen: string[] = [];
  public modalSelectedOptions: string[] = [];
  private modalCheckboxItems: Checkbox[] = [];
  public isIL6Selected = false;
  public IL6SysId = "";


  public openModal(): void {
    this.modalSelectionsOnOpen = this.modalSelectedOptions;
    this.showDialog = true;
  }
  public modalCancelClicked(): void {
    this.showDialog = false;
  }
  public async modalOkClicked(): Promise<void> {
    this.showDialog = false;


    // remove any previously selected classifications no longer selected in modal
    const keepSelected = this.modalSelectedOptions;
    this.selectedHeaderLevelSysIds = this.selectedHeaderLevelSysIds.filter((sysId) => {
      return keepSelected.indexOf(sysId) > -1;
    });
    const currentData = await buildCurrentSelectedClassLevelList(this.modalSelectedOptions,
      this.acquisitionPackage?.sys_id as string, this.selectedClassificationLevelList)
    await classificationRequirements.saveSelectedClassificationLevels(currentData);
    setTimeout(async () => {

      this.selectedClassificationLevelList =
        await ClassificationRequirements.getSelectedClassificationLevels();

      await this.setAvailableClassificationLevels();
      await this.buildNewClassificationInstances();
      await this.checkSingleClassification();
      ClassificationRequirements.createToast();
    }, 1000);


  }

  /* eslint-disable camelcase */
  public get currentData(): ArchitecturalDesignRequirementDTO {
    return this.DOWArchNeeds
  };
  private createCheckboxItems(data: ClassificationLevelDTO[]) {
    return buildClassificationCheckboxList(data, "", false, true);
  }


  public savedData: ArchitecturalDesignRequirementDTO[] = []
  // {
  //   source: "DOW",
  //   statement: "",
  //   applications_needing_design: "",
  //   data_classification_levels: [],
  //   external_factors: "",
  //   acquisition_package: AcquisitionPackage.packageId,
  //   needs_architectural_design_services:""
  // }
  /* eslint-enable camelcase */

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    this.selectedClassificationLevelList =
      await classificationRequirements.getSelectedClassificationLevels();
    this.classificationCheckboxes =this.createCheckboxItems(this.selectedClassificationLevelList)
    this.allClassificationLevels
      = await ClassificationRequirements.getAllClassificationLevels();
    const IL6Checkbox
      = this.modalCheckboxItems.find(e => e.label.indexOf("IL6") > -1);
    this.IL6SysId = IL6Checkbox?.value || "";
    this.modalCheckboxItems = this.createCheckboxItems(this.allClassificationLevels, "Modal");
    if(this.selectedClassificationLevelList.length === 1){
      this.classificationLabel =
        buildClassificationLabel(this.selectedClassificationLevelList[0],"string",false)
    }
    if(this.selectedClassificationLevelList) {
      this.selectedClassificationLevelList.forEach((val) => {
        val = convertColumnReferencesToValues(val);
        this.modalSelectedOptions.push(val.classification_level as string)
      });
    }
    const storeData = await DescriptionOfWork.getDOWArchitecturalNeeds();
    // if (storeData) {
    //   this.DOWArchNeeds = _.cloneDeep(storeData);
    //   this.savedData = _.cloneDeep(storeData);
    // }
  }

  // private hasChanged(): boolean {
  //   return hasChanges(this.currentData, this.savedData);
  // }

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
