<template>
  <div>

    <h1 class="page-header mb-3" tabindex="-1">
      <span v-if="firstTimeHere || isPortabilityPlan ">
        Let’s gather your requirements for {{ serviceGroupVerbiageInfo.offeringName }}
      </span>
      <span v-else>
        Let’s gather some details for 
        {{ serviceGroupVerbiageInfo.heading2 }} #{{ _serviceOfferingData.instanceNumber }}
      </span>
    </h1>
    <p v-if="isPortabilityPlan">
      Refer to the JWCC Contract Performance Work 
      Statement (PWS) for the definition of a Portability Plan.
    </p>
    <p
      v-else 
      class="copy-max-width"
      :class="isClassificationDataMissing || isPeriodsDataMissing ? 'mb-4' : 'mb-10'"
    >
      <span v-if="firstTimeHere">
        In this section, we’ll collect details 
        about {{ serviceGroupVerbiageInfo.introText }} 
      </span>

      If you need multiple, we’ll walk through them one at a time. 
      <span v-if="selectedClassificationLevelList.length === 1">
        This {{ serviceGroupVerbiageInfo.typeForText }} will be within the 
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
      v-show="isClassificationDataMissing || isPeriodsDataMissing"
      :isClassificationDataMissing="isClassificationDataMissing"
      :isPeriodsDataMissing="isPeriodsDataMissing"
      class="copy-max-width"
    />

    <v-expand-transition>
      <ATATAlert
        id="ErrorsOnLoadAlert"
        v-show="formHasErrors === true && formHasBeenTouched === true"
        type="error"
        class="mb-10"
      >
        <template v-slot:content>
          <p class="mb-0" id="ErrorsOnLoadAlertText">
            Some of your info is missing. You can add it now or come back at any 
            time before finalizing your acquisition package.
          </p>
        </template>
      </ATATAlert>
    </v-expand-transition>


    <h2 class="mb-5" 
      id="FormSection1Heading"
      v-if="isCompute || isDatabase || isTraining || isStorage"
    >
      1. {{ sectionOneSubhead }}
    </h2>

    <v-form ref="form" lazy-validation>

      <div class="mb-10">
        <div v-if="selectedClassificationLevelList.length > 1"> 
          <ATATRadioGroup
            v-if="!isPortabilityPlan"
            id="ClassificationLevel"
            ref="ClassificationLevelRef"
            legend="What classification level is this instance deployed in?"
            :value="_serviceOfferingData.classificationLevel"
            @update:value="_serviceOfferingData.classificationLevel = $event"
            :items="classificationRadioOptions"
            name="ClassificationLevel"
            class="mt-3 mb-2"
            :tooltipText="classificationTooltipText"
            tooltipLabel="Classification level for this instance"
            :rules="[$validators.required('Please select a classification level.')]"
          />
          <a 
            role="button" 
            id="UpdateClassificationFromRadios"
            tabindex="0"
            @click="openModal"
            @keydown.enter="openModal"
            @keydown.space="openModal"
          >Update your Classification Requirements
          </a>
        </div>
        <div else>
          <ATATCheckboxGroup
            v-if="isPortabilityPlan"
            id="ClassificationLevel"
            ref="ClassificationLevelRef"
            groupLabel="What classification level(s) do you need a Portability Plan for?"
            :value="_portabilityClassificationLevels"
            @update:value="_portabilityClassificationLevels = $event"
            :items="classificationRadioOptions"
            name="ClassificationLevel"
            class="mt-3 mb-2"
            :tooltipText="classificationTooltipText"
            tooltipLabel="Classification level for this instance"
            :rules="[$validators.required('Please select a classification level.')]"
          />
        </div>
      </div>

      <ComputeFormElements
        ref="ComputeFormElementsRef"
        v-if="isCompute"
        :data="_serviceOfferingData"
        @update:data="_serviceOfferingData = $event"
      />

      <DatabaseFormElements
        ref="DatabaseFormElementsRef"
        v-if="isDatabase"
        :data="_serviceOfferingData"
        @update:data="_serviceOfferingData = $event"
      />

      <StorageFormElements
        v-if="isStorage"
        ref="StorageFormElementsRef"
        :data="_serviceOfferingData"
        @update:data="_serviceOfferingData = $event"
        :storageUnits="storageUnits"
      />

      <TrainingFormElements
        v-if="isTraining"
        ref="TrainingFormElementsRef"
        :data="_serviceOfferingData"
        @update:data="_serviceOfferingData = $event"

      />
      
      <section v-if="isCompute || isDatabase">
        <hr />
        <h2>
          2. {{ isCompute ? 'Instance' : 'Database' }} Configurations
        </h2>

        <InstanceConfig
          ref="InstanceConfigRef"
          :data="_serviceOfferingData"
          @update:data="_serviceOfferingData = $event"
          :storageUnits="storageUnits"
          :isDOW="true"
        />

        <PerformanceTier 
          ref="PerformanceTierRef"
          :isCompute="isCompute"
          :isDatabase="isDatabase"
          :isDOW="true"
          :data="_serviceOfferingData"
          @update:data="_serviceOfferingData = $event"
          :storageUnits="storageUnits"
        />
      </section>

      <div v-if="isCompute || isDatabase || isStorage || isTraining">
        <hr/>
        <h2 class="mb5">
          {{ isStorage || isTraining ? '2' : '3' }}. Anticipated need and duration
        </h2>
        <br/>
      </div>
      
      <div v-if="!isPortabilityPlan">
        <AnticipatedDurationandUsage
          ref="AnticipatedDurationAndUsageRef"
          :typeForUsage="serviceGroupVerbiageInfo.typeForUsage"
          :typeForDuration="serviceGroupVerbiageInfo.typeForText"
          :index="_serviceOfferingData.instanceNumber"
          :isPeriodsDataMissing="isPeriodsDataMissing"
          :availablePeriodCheckboxItems="availablePeriodCheckboxItems"
          :anticipatedNeedUsage="_serviceOfferingData.descriptionOfNeed"
          @update:anticipatedNeedUsage="_serviceOfferingData.descriptionOfNeed = $event"
          :entireDuration="_serviceOfferingData.entireDuration"
          @update:entireDuration="_serviceOfferingData.entireDuration = $event"
          :selectedPeriods="_serviceOfferingData.periodsNeeded"
          @update:selectedPeriods="_serviceOfferingData.periodsNeeded = $event"

        />
      </div>
      

      <div v-if="isSupport" class="mt-10">
        <ATATRadioGroup
          ref="SupportRadioGroupRef"
          class="copy-max-width mb-10 mt-0"
          legend="Will this service require CSP personnel to access on-site locations?"
          :items="onsiteAccessOptions"
          :value="_serviceOfferingData.personnelOnsiteAccess"
          @update:value="_serviceOfferingData.personnelOnsiteAccess = $event"
          :rules="[
            $validators.required(
              'Please select an option.'
            )
          ]"
        />
      </div>
  
    </v-form>

    <ClassificationsModal 
      :showDialog="showDialog"
      @cancelClicked="modalCancelClicked"
      @okClicked="classificationLevelsChanged"
      :modalSelectedOptions="modalSelectedOptions"
      @update:modalSelectedOptions="modalSelectedOptions = $event"
      :modalSelectionsOnOpen="modalSelectionsOnOpen"
      :modalCheckboxItems="modalCheckboxItems"
      :IL6SysId="IL6SysId"
      :isIL6Selected="isIL6Selected"
      @update:isIL6Selected="isIL6Selected = $event"
    />

  </div>
</template>

<script lang="ts">
import { ComponentPublicInstance } from "vue";
import { Component, Prop, Watch, Vue, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom"
import ClassificationsModal from "./ClassificationsModal.vue";
import ComputeFormElements from "./ComputeFormElements.vue"
import DatabaseFormElements from "./DatabaseFormElements.vue";
import StorageFormElements from "./StorageFormElements.vue";
import TrainingFormElements from "./TrainingFormElements.vue";
import AnticipatedDurationandUsage from "@/components/DOW/AnticipatedDurationandUsage.vue";
import InstanceConfig from "@/components/DOW/InstanceConfig.vue";
import PerformanceTier from "@/components/DOW/PerformanceTier.vue";


import DOWSubtleAlert from "./DOWSubtleAlert.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";

import { 
  Checkbox, 
  OtherServiceOfferingData,
  RadioButton,
  SelectData,
} from "../../../../types/Global";

import ClassificationRequirements from "@/store/classificationRequirements";
import {
  AcquisitionPackageDTO,
  ClassificationLevelDTO,
  SelectedClassificationLevelDTO
} from "@/api/models";

import { 
  buildClassificationCheckboxList, 
  buildClassificationLabel,
  createPeriodCheckboxItems,
} from "@/helpers";
import DescriptionOfWork from "@/store/descriptionOfWork";
import {
  buildCurrentSelectedClassLevelList
} from "@/packages/helpers/ClassificationRequirementsHelper";
import AcquisitionPackage from "@/store/acquisitionPackage";
import classificationRequirements from "@/store/classificationRequirements";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import { SubmitEventPromise } from "vuetify/lib/framework.mjs";

@Component({
  components: {
    ATATCheckboxGroup,
    ClassificationsModal,
    ComputeFormElements,
    AnticipatedDurationandUsage,
    DOWSubtleAlert,
    ATATAlert,
    InstanceConfig,
    PerformanceTier,
    DatabaseFormElements,
    StorageFormElements,
    TrainingFormElements,
    ATATRadioGroup,
  }
})

class OtherOfferings extends Vue
{
  $refs!: {
    form: ComponentPublicInstance & {
      resetValidation: () => void;
      validate: () => Promise<SubmitEventPromise>;
    },
  };

  @PropSync("serviceOfferingData") public _serviceOfferingData!: OtherServiceOfferingData;
  @PropSync("portabilityClassificationLevels") public _portabilityClassificationLevels!: string[];
  @Prop() public isPeriodsDataMissing!: boolean;
  @Prop() public isClassificationDataMissing!: boolean;
  @Prop() public otherOfferingList!: string[];

  public firstTimeHere = false;
  public modalSelectionsOnOpen: string[] = [];
  public showDialog = false;
  public modalSelectedOptions: string[] = [];
  public modalCheckboxItems: Checkbox[] = [];
  public isIL6Selected = false;
  public IL6SysId = "";
  public allClassificationLevels:ClassificationLevelDTO[] = [];
  public selectedClassificationLevelList: SelectedClassificationLevelDTO[] = [];
  public classificationRadioOptions: RadioButton[] = [];
  public singleClassificationLevelName: string | undefined = "";
  public availablePeriodCheckboxItems: Checkbox[] = [];
  public formHasBeenTouched = false;
  public formHasErrors = false;
  public errorBagValues: boolean[] = []
  public hasErrorsOnLoad = false;
  public validateOtherTierNow = false;
  public validateOtherTierOnBlur = false;
  public otherRegionValue = "OtherRegion";
  public otherPerformanceTierValue = "OtherPerformance";
  public clearOtherTierValidation = false;
  public acquisitionPackage: AcquisitionPackageDTO | undefined;

  public serviceGroupOnLoad = "";
  public isStorage = false;
  public isCompute = false;
  public isGeneralXaaS = false;
  public isDatabase = false;
  public isSupport = false;
  public isTraining = false;
  public isPortabilityPlan = false;
  public itemSysIdsDeleted:string[] = [];

  public serviceGroupVerbiageInfo: Record<string, string> = {};

  public get sectionOneSubhead(): string {
    let subhead = "Instance details";
    switch(this.serviceGroupOnLoad.toLowerCase()) {
    case "training":
      subhead = "Training details";
      break;
    case "database":
      subhead = "Database details";
      break;
    case "storage":
      subhead = "Storage configurations"
      break;
    }
    return subhead;
  }

  
  public introOfferingString = "";

  public storageUnits: SelectData[] = [
    { text: "Gigabyte (GB)", value: "GB" },
    { text: "Terabyte (TB)", value: "TB" },
    { text: "Petabyte (PB)", value: "PB" },
  ];

  public onsiteAccessOptions: RadioButton[] = [
    {
      id: "Yes",
      label: "Yes",
      value: "YES",
    },
    {
      id: "No",
      label: "No",
      value: "NO",
    },
  ];

  public openModal(): void {
    this.modalSelectionsOnOpen = this.modalSelectedOptions;
    this.showDialog = true;
  }

  public modalCancelClicked(): void {
    this.showDialog = false;
  }

  public setAvlClassificationLevels(): void {
    this.classificationRadioOptions 
      = this.createCheckboxOrRadioItems(this.selectedClassificationLevelList, "Radio");
  }

  public checkSingleClassification(): void {
    // if only one classification level selected in Contract Details or the 
    // classifications modal, set it as the "selected" classification level
    if (
      this.selectedClassificationLevelList.length === 1
      && this.selectedClassificationLevelList[0].classification_level
    ) {
      const classificationObj = this.selectedClassificationLevelList[0];
      this._serviceOfferingData.classificationLevel
        = classificationObj.classification_level as string;
      this.singleClassificationLevelName
        = buildClassificationLabel(classificationObj, "short");
    }
  }

  public async classificationLevelsChanged(): Promise<void> {
    this.showDialog = false;
    const currentData = buildCurrentSelectedClassLevelList(this.modalSelectedOptions,
        this.acquisitionPackage?.sys_id as string, this.selectedClassificationLevelList)
     
    await classificationRequirements.saveSelectedClassificationLevels(currentData)
    // await classificationRequirements.loadSelectedClassificationLevelsByAqId(
    //     this.acquisitionPackage?.sys_id as string);
    setTimeout(async () => {
      this.selectedClassificationLevelList = 
        await ClassificationRequirements.getSelectedClassificationLevels();
    
      await this.setAvailableClassificationLevels()
      this.setAvlClassificationLevels();
      if (this.selectedClassificationLevelList.length === 1) {
        this.checkSingleClassification();
      } else if (this._serviceOfferingData.classificationLevel) {
      // if the classification level that was selected was removed via the modal,
      // clear out this._serviceOfferingData.classificationLevel
        const selectedSysId = this._serviceOfferingData.classificationLevel;
        if (this.modalSelectedOptions.indexOf(selectedSysId) === -1) {
          this._serviceOfferingData.classificationLevel = "";
        }
        this._portabilityClassificationLevels.forEach((sysId:string,idx:number) => {
          if(this.modalSelectedOptions.indexOf(sysId) === -1){
            this._portabilityClassificationLevels.splice(idx,1)
          }
        })
      }
      ClassificationRequirements.createToast();
     
    }, 1000);
  }

 

  private createCheckboxOrRadioItems(data: ClassificationLevelDTO[], idSuffix: string)
    : Checkbox[] {
    idSuffix = idSuffix || "";
    const hasValidData = 
      this.isPortabilityPlan && data.length > 0
      || data.length > 1
    return hasValidData 
      ? buildClassificationCheckboxList(data, idSuffix, false, false) 
      : [];
  }

  public async setAvailableClassificationLevels(): Promise<void> {
    this.selectedClassificationLevelList 
      = await ClassificationRequirements.getSelectedClassificationLevels();
  }


  public async loadOnEnter(): Promise<void> {
    this.serviceGroupVerbiageInfo = await DescriptionOfWork.getServiceGroupVerbiageInfo();
    this.acquisitionPackage = await AcquisitionPackage
      .getAcquisitionPackage() as AcquisitionPackageDTO;
    this.serviceGroupOnLoad = DescriptionOfWork.currentGroupId;
    this.isCompute = this.serviceGroupOnLoad.toLowerCase() === "compute";
    this.isGeneralXaaS = this.serviceGroupOnLoad.toLowerCase() === "general_xaas";
    this.isDatabase = this.serviceGroupOnLoad.toLowerCase() === "database";
    this.isStorage = this.serviceGroupOnLoad.toLowerCase() === "storage";
    this.isTraining = this.serviceGroupOnLoad.toLowerCase() === "training";
    this.isPortabilityPlan = this.serviceGroupOnLoad.toLowerCase() === "portability_plan";

    this.isSupport = [
      "advisory_assistance",
      "help_desk_services",
      "documentation_support",
      "general_cloud_support"
    ].includes(this.serviceGroupOnLoad.toLowerCase());

    const otherOfferingObj = DescriptionOfWork.otherOfferingObject;
    this.firstTimeHere 
      = !otherOfferingObj.otherOfferingData || otherOfferingObj.otherOfferingData.length === 0;
    // get classification levels selected in step 4 Contract Details
    this.selectedClassificationLevelList 
      = await ClassificationRequirements.getSelectedClassificationLevels();
    // set checked items in modal to classification levels selected in step 4 Contract Details
    if (this.selectedClassificationLevelList) {
      this.selectedClassificationLevelList.forEach((val) => {
        this.modalSelectedOptions.push(val.classification_level as string)
      });
      this.checkSingleClassification();
    }

    // set available classification levels for radio buttons if > 1 level selected
    await this.setAvailableClassificationLevels();
    // get list of all possible classification levels to generate checkbox list and labels
    this.allClassificationLevels
      = await ClassificationRequirements.getAllClassificationLevels();
    this.modalCheckboxItems 
      = this.createCheckboxOrRadioItems(this.allClassificationLevels, "Modal");
    const IL6Checkbox 
      = this.modalCheckboxItems.find(e => e.label.indexOf("IL6") > -1);
    this.IL6SysId = IL6Checkbox?.value || "";
    
    this.setAvlClassificationLevels();
    this.checkSingleClassification();

    this.availablePeriodCheckboxItems = await createPeriodCheckboxItems();
  }

  public async setComponentSpecificData(): Promise<void> {
    if (this.isStorage   || 
      this.isCompute   ||
      this.isDatabase  ||
      this.isSupport   ||
      this.isTraining  ||
      this.isPortabilityPlan || 
      this.isGeneralXaaS) {
      this.formHasBeenTouched 
        = await DescriptionOfWork.hasInstanceBeenTouched(this._serviceOfferingData.instanceNumber);
    }
    
    this.formHasBeenTouched 
      ? await this.setErrorMessages()
      : this.validateOtherTierOnBlur = true;

    return;
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
    await this.setComponentSpecificData();
  }

  @Watch("errorBagValues")
  public errorBagChange(): void {
    this.setErrorMessages();
  }

  private setErrorMessages(): void {
    this.$nextTick(() => {
      this.$refs.form.validate().then(
        async (response:SubmitEventPromise)=>{
          this.errorBagValues = [(await (response)).valid]; 
          this.formHasErrors = this.errorBagValues.includes(true);
        }
      );
    });
  }

  public classificationTooltipText = `The levels listed below are based on the overall 
    classification requirements you previously specified.`;

}
export default toNative(OtherOfferings)
 
</script>
