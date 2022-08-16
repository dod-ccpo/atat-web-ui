<template>
  <v-form ref="generalXaaSForm">
    <h1 class="page-header mb-3" tabindex="-1">
      <span v-if="firstTimeHere">
        Let’s gather your requirements for general IaaS, PaaS and SaaS
      </span>
      <span v-else>
        Let’s gather some details for Requirement #{{ _generalXaaSData.instanceNumber }}
      </span>
    </h1>

    <p 
      class="copy-max-width"
      :class="showSubtleAlert ? 'mb-4' : 'mb-10'"
    >
      <span v-if="firstTimeHere">
        In this section, we will collect details about any third-party marketplace 
        solutions or cloud resources not covered in the other XaaS categories. 
      </span>

      If you have more than one requirement, we will walk through them one at a time. 

      <span v-if="avlClassificationLevelObjects.length === 1">
        This requirement will be within the 
        <strong>{{ singleClassificationLevelName }}</strong> classification level.
        If you need a different level, 
        <a 
          role="button" 
          id="UpdateClassificationFromIntro"
          tabindex="0"
          @click="openModal"
          @keydown.enter="openModal"
          @keydown.space="openModal"
        >update your Classification Requirements</a>.
      </span>
    </p>
    
    <DOWSubtleAlert
      v-show="showSubtleAlert"
      :isClassificationDataMissing="isClassificationDataMissing"
      :isPeriodsDataMissing="isPeriodsDataMissing"
      class="copy-max-width"
    />

    <ATATTextField 
      :id="'RequirementTitle_' + (index + 1)"
      label="Requirement title"
      class="_input-max-width mb-10"
      tooltipText="Enter a title that briefly describes this IaaS, 
        PaaS or SaaS requirement."
      :value="requirementTitle"
    />

    <div v-if="avlClassificationLevelObjects.length > 1" class="mb-8">
      <ATATRadioGroup
        id="ClassificationLevel"
        legend="What classification level is this requirement deployed in?"
        :value="_generalXaaSData.classificationLevel"
        :items="classificationRadioOptions"
        name="ClassificationLevel"
        class="mt-3 mb-2"
        :tooltipText="classificationTooltipText"
        tooltipLabel="Classification level for this requirement"
        :rules="[$validators.required('Please select a classification level.')]"
      />
      <a 
        role="button" 
        id="UpdateClassificationFromRadios"
        tabindex="0"
        @click="openModal"
        @keydown.enter="openModal"
        @keydown.space="openModal"
      >Update your Classification Requirements</a>
    </div>

    <ClassificationsModal 
      :showDialog="showDialog"
      @cancelClicked="modalCancelClicked"
      @okClicked="classificationLevelsChanged"
      :modalSelectedOptions.sync="modalSelectedOptions"
      :modalSelectionsOnOpen="modalSelectionsOnOpen"
      :modalCheckboxItems="modalCheckboxItems"
      :IL6SysId="IL6SysId"
      :isIL6Selected.sync="isIL6Selected"
    />

  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync } from "vue-property-decorator";

import { ClassificationLevelDTO } from "@/api/models";
import { DOWClassificationInstance, GeneralXaaSData } from "../../../../types/Global";

import DOWSubtleAlert from "./DOWSubtleAlert.vue";
import ClassificationsModal from "./ClassificationsModal.vue";

import { routeNames } from "../../../router/stepper"
import Periods from "@/store/periods";
import { PeriodDTO } from "@/api/models";
import classificationRequirements from "@/store/classificationRequirements";
import Toast from "@/store/toast";
import ClassificationRequirements from "@/store/classificationRequirements";

import { 
  Checkbox, 
  ComputeData,
  RadioButton,
  SelectData,
  ToastObj,
} from "../../../../types/Global";

import { 
  buildClassificationCheckboxList, 
  buildClassificationLabel 
} from "@/helpers";
import DescriptionOfWork from "@/store/descriptionOfWork";

@Component({})


export default class GeneralXaaS extends Vue {
  @PropSync("generalXaaSData") public _generalXaaSData!: GeneralXaaSData;
  public firstTimeHere = true;
  public showSubtleAlert = false;
  public routeNames = routeNames;
  public modalSelectionsOnOpen: string[] = [];
  public showDialog = false;
  public modalSelectedOptions: string[] = [];
  public modalCheckboxItems: Checkbox[] = [];
  public isIL6Selected = false;
  public IL6SysId = "";
  public allClassificationLevels:ClassificationLevelDTO[] = [];
  public avlClassificationLevelObjects: ClassificationLevelDTO[] = [];
  public classificationRadioOptions: RadioButton[] = [];
  public singleClassificationLevelName: string | undefined = "";

  public classificationLevelToast: ToastObj = {
    type: "success",
    message: "Classification requirements updated",
    isOpen: true,
    hasUndo: false,
    hasIcon: true,
  };

  // EJY below is copied from ComputeForm
  public openModal(): void {
    this.modalSelectionsOnOpen = this.modalSelectedOptions;
    this.showDialog = true;
  }

  public modalCancelClicked(): void {
    this.showDialog = false;
  }

  public setAvlClassificationLevels(): void {
    this.classificationRadioOptions 
      = this.createCheckboxOrRadioItems(this.avlClassificationLevelObjects, "Radio");
  }

  public checkSingleClassification(): void {
    // if only one classification level selected in Contract Details or the 
    // classifications modal, set it as the "selected" classification level
    if (
      this.avlClassificationLevelObjects.length === 1
      && this.avlClassificationLevelObjects[0].sys_id
    ) {
      const classificationObj = this.avlClassificationLevelObjects[0];
      this._generalXaaSData.classificationLevel = classificationObj.sys_id;
      this.singleClassificationLevelName 
        = buildClassificationLabel(classificationObj, "short");
    }
  }

  public async classificationLevelsChanged(): Promise<void> {
    this.showDialog = false;
    this.avlClassificationLevelObjects = [];
    this.modalSelectedOptions.forEach((sysId) => {
      const classififcationObj = this.allClassificationLevels.find(obj => obj.sys_id === sysId);
      if (classififcationObj) {
        this.avlClassificationLevelObjects.push(classififcationObj);
      }
    });
    this.setAvlClassificationLevels();

    if (this.avlClassificationLevelObjects.length === 1) {
      this.checkSingleClassification();
    } else if (this._generalXaaSData.classificationLevel) {
      // if the classification level that was selected was removed via the modal,
      // clear out this._generalXaaSData.classificationLevel
      const selectedSysId = this._generalXaaSData.classificationLevel;
      if (this.modalSelectedOptions.indexOf(selectedSysId) === -1) {
        this._generalXaaSData.classificationLevel = "";
      }
    }

    await ClassificationRequirements.setSelectedClassificationLevels(
      this.avlClassificationLevelObjects
    );

    Toast.setToast(this.classificationLevelToast);
  }

  private createPeriodCheckboxItems(periods: PeriodDTO[]) {
    // ensure sort order is correct
    periods.sort((a, b) => a.option_order > b.option_order ? 1 : -1);
    
    const arr: Checkbox[] = [];
    periods.forEach((period, i) => {
      const label = i === 0 ? "Base period" : `Option period ${i}`;
      const id = i === 0 ? "BASE" : `OPTION${i}`;
      const option: Checkbox = {
        id,
        label,
        value: period.sys_id || "",
      };
      arr.push(option);
    })
    return arr;
  }

  private createCheckboxOrRadioItems(data: ClassificationLevelDTO[], idSuffix: string) {
    idSuffix = idSuffix || "";
    return data.length > 1 ? buildClassificationCheckboxList(data, idSuffix, false, false) : [];
  }

  public async setAvailableClassificationLevels(): Promise<void> {
    this.avlClassificationLevelObjects 
      = await ClassificationRequirements.getSelectedClassificationLevels();
  }

  // EJY above is copied from ComputeForm


}

</script>
