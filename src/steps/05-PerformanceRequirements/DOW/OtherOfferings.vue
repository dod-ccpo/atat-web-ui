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

      <div v-if="selectedClassificationLevelList.length > 1" class="mb-10">
        <ATATRadioGroup
          id="ClassificationLevel"
          legend="What classification level is this instance deployed in?"
          :value.sync="_serviceOfferingData.classificationLevel"
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
        >Update your Classification Requirements</a>
      </div>

      <ComputeFormElements
        v-if="isCompute"
        :data.sync="_serviceOfferingData"  
      />

      <DatabaseFormElements
        v-if="isDatabase"
        :data.sync="_serviceOfferingData"  
      />

      <StorageFormElements
        v-if="isStorage"
        :data.sync="_serviceOfferingData"
        :storageUnits="storageUnits"
      />

      <TrainingFormElements
        v-if="isTraining"
        :data.sync="_serviceOfferingData"
      />
      
      <section v-if="isCompute || isDatabase">
        <hr />
        <h2>
          2. {{ isCompute ? 'Instance' : 'Database' }} Configurations
        </h2>

        <InstanceConfig
          :data.sync="_serviceOfferingData"
          :storageUnits="storageUnits"
          :isDOW="true"
        />

        <PerformanceTier 
          :isCompute="isCompute"
          :isDatabase="isDatabase"
          :isDOW="true"
          :data.sync="_serviceOfferingData"
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
          :typeForUsage="serviceGroupVerbiageInfo.typeForUsage"
          :typeForDuration="serviceGroupVerbiageInfo.typeForText"
          :index="_serviceOfferingData.instanceNumber"
          :isPeriodsDataMissing="isPeriodsDataMissing"
          :availablePeriodCheckboxItems="availablePeriodCheckboxItems"
          :anticipatedNeedUsage.sync="_serviceOfferingData.descriptionOfNeed"
          :entireDuration.sync="_serviceOfferingData.entireDuration"
          :selectedPeriods.sync="_serviceOfferingData.periodsNeeded"
        />
      </div>
      

      <div v-if="isSupport" class="mt-10">
        <ATATRadioGroup
          class="copy-max-width mb-10 mt-0"
          legend="Will this service require CSP personnel to access on-site locations?"
          :items="onsiteAccessOptions"
          :value.sync="_serviceOfferingData.personnelOnsiteAccess"
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
      :modalSelectedOptions.sync="modalSelectedOptions"
      :modalSelectionsOnOpen="modalSelectionsOnOpen"
      :modalCheckboxItems="modalCheckboxItems"
      :IL6SysId="IL6SysId"
      :isIL6Selected.sync="isIL6Selected"
    />

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";

import ClassificationsModal from "./ClassificationsModal.vue";
import ComputeFormElements from "./ComputeFormElements.vue"
import DatabaseFormElements from "./DatabaseFormElements.vue";
import StorageFormElements from "./StorageFormElements.vue";
import TrainingFormElements from "./TrainingFormElements.vue";
import AnticipatedDurationandUsage from "@/components/DOW/AnticipatedDurationandUsage.vue";
import InstanceConfig from "@/components/DOW/InstanceConfig.vue";
import PerformanceTier from "@/components/DOW/PerformanceTier.vue";

import Toast from "@/store/toast";

import DOWSubtleAlert from "./DOWSubtleAlert.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import _ from "lodash";

import { 
  Checkbox, 
  OtherServiceOfferingData,
  RadioButton,
  SelectData,
  ToastObj,
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
  setItemToPlural,
} from "@/helpers";
import DescriptionOfWork from "@/store/descriptionOfWork";
import {
  buildCurrentSelectedClassLevelList
} from "@/packages/helpers/ClassificationRequirementsHelper";
import AcquisitionPackage from "@/store/acquisitionPackage";
import classificationRequirements from "@/store/classificationRequirements";

@Component({
  components: {
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

export default class OtherOfferings extends Vue {
  $refs!: {
    form: Vue & {
      resetValidation: () => void;
      errorBucket: string[];
      reset: () => void;
      validate: () => boolean;
      errorBag: Record<number, boolean>;
    },
  };

  @PropSync("serviceOfferingData") public _serviceOfferingData!: OtherServiceOfferingData;
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
      }
      ClassificationRequirements.createToast();
     
    }, 1000);
  }

 

  private createCheckboxOrRadioItems(data: ClassificationLevelDTO[], idSuffix: string) {
    idSuffix = idSuffix || "";
    return data.length > 1 ? buildClassificationCheckboxList(data, idSuffix, false, false) : [];
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
    if (this.formHasBeenTouched) {
      // user is editing an existing instance, validate on load
      await this.validate();
      this.$nextTick(async () => {
        this.setErrorMessages();
      });
    } else {
      this.validateOtherTierOnBlur = true;
    }
    return;
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
    await this.setComponentSpecificData();
  }

  public formComponentUpdate(): void {
    const eb = this.$refs.form.errorBag;
    this.errorBagValues = Object.values(eb);
  }

  @Watch("errorBagValues")
  public errorBagChange(): void {
    this.$nextTick(() => {
      const errorBag = Object.values(this.$refs.form.errorBag);
      this.formHasErrors = errorBag.includes(true);
    });
  }
  
  get Form(): Vue & { validate: () => boolean } {
    return this.$refs.form as Vue & { validate: () => boolean };
  }

  public async validate(): Promise<void> {
    this.$nextTick(() => {
      this.Form.validate();
    });
  }
    
  private setErrorMessages(): void {
    if (!this.$refs.form) {
      return;
    }
    this.errorBagValues = Object.values(this.$refs.form.errorBag);
    let formChildren = this.$refs.form.$children;
    this.$refs.form.$children.forEach(children => {
      formChildren = formChildren.concat(children.$children);
    });
    const inputRefs = [
      "radioButtonGroup", "atatTextField", "atatTextArea", "atatSelect", "checkboxGroup",
    ];
    const customComponentRefs = ["NeededForEntireDuration", "DescriptionOfNeed"];
    formChildren.forEach((child: any) => {
      const refs = child.$refs;
      const keys = Object.keys(refs);
      keys.forEach((key: string) => {
        if (inputRefs.indexOf(key) > -1 || customComponentRefs.indexOf(key) > -1) {
          const childRef: any = child.$refs[key];
          if (childRef[0]) {
            if (this.isCompute && childRef[0].attrs$["data-group-id"] === "Regions_Group"
            && this._serviceOfferingData.deployedRegions
              && this._serviceOfferingData.deployedRegions.indexOf(this.otherRegionValue) > -1
              && this._serviceOfferingData.deployedRegionsOther === ""
            ) {
              const otherIndex = child.$children.length - 2;
              const eb = child.$children[otherIndex].$children[1].$children[0].errorBucket;
              if (eb.length) {
                this.hasErrorsOnLoad = true;
                child.$refs["atatTextInput"][0].errorMessages.push(eb[0]);
              }
            }
          }
          if (!this.isPortabilityPlan) {
            if (this.isCompute && key === "radioButtonGroup"
              && child.$el.attributes.id.value.indexOf("PerformanceTier")
              && this._serviceOfferingData.performanceTier === this.otherPerformanceTierValue
            ) {
              if (this._serviceOfferingData.performanceTierOther === "") {
                this.validateOtherTierOnBlur = true;
                this.validateOtherTierNow = true;
              } else {
                this.validateOtherTierOnBlur = false;
                this.clearOtherTierValidation = true;
              }
            }
            if (key === "NeededForEntireDuration" || key === "DescriptionOfNeed") {
              const errors: string[] = child.$children[0].$children[0].errorBucket;
              if (errors.length) {
                this.hasErrorsOnLoad = true;
                errors.forEach((error) => {
                  child.$children[0].errorMessages.push(error);
                })
              }

              if (key === "NeededForEntireDuration") {
                child.$children.forEach((childChild: any, i: number) => {
                  if (child.$children[i].$el.id.indexOf("PeriodsCheckboxes") > -1
                    && this._serviceOfferingData.entireDuration.toLowerCase() === "no"
                    && this._serviceOfferingData.periodsNeeded.length === 0
                  ) {
                    child.$children[i].errorMessages.push(
                      `Please select at least one base or option period.`
                    );
                  }                
                })
              }
            }
          }
          
          if (childRef && Object.prototype.hasOwnProperty.call(childRef, "errorBucket")) {
            const errorBucket: string[] = childRef.errorBucket;
            if (errorBucket.length) {
              this.hasErrorsOnLoad = true;
              errorBucket.forEach((error) => {
                child.errorMessages.push(error);
              });
            }
          }
        }
      });
    });
  }

  public classificationTooltipText = `The levels listed below are based on the overall 
    classification requirements you previously specified.`;

}

</script>
