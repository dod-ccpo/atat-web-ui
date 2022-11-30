<template>
  <div>
    <v-form ref="serviceOfferingForm">
      <ComputeForm
        v-if="isCompute"
        :computeData.sync="_serviceOfferingData"
        :firstTimeHere="firstTimeHere"
        :isClassificationDataMissing="isClassificationDataMissing"
        :isPeriodsDataMissing="isPeriodsDataMissing"
        :avlClassificationLevelObjects="avlClassificationLevelObjects"
        :singleClassificationLevelName="singleClassificationLevelName"
        :formHasErrors="formHasErrors"
        :formHasBeenTouched="formHasBeenTouched"
        :classificationRadioOptions="classificationRadioOptions"
        :classificationTooltipText="classificationTooltipText"
        :otherRegionValue="otherRegionValue"
        :otherPerformanceTierValue="otherPerformanceTierValue"
        :availablePeriodCheckboxItems="availablePeriodCheckboxItems"
        :validateOtherTierNow="validateOtherTierNow"
        :validateOtherTierOnBlur="validateOtherTierOnBlur"
        :clearOtherTierValidation="clearOtherTierValidation"
        @openModal="openModal"
        @formUpdate="formComponentUpdate"
      />

      <DatabaseForm
        v-if="isDatabase"
        :databaseData.sync="_serviceOfferingData"
        :firstTimeHere="firstTimeHere"
        :isClassificationDataMissing="isClassificationDataMissing"
        :isPeriodsDataMissing="isPeriodsDataMissing"
        :avlClassificationLevelObjects="avlClassificationLevelObjects"
        :singleClassificationLevelName="singleClassificationLevelName"
        :formHasErrors="formHasErrors"
        :formHasBeenTouched="formHasBeenTouched"
        :classificationRadioOptions="classificationRadioOptions"
        :classificationTooltipText="classificationTooltipText"
        :otherRegionValue="otherRegionValue"
        :otherPerformanceTierValue="otherPerformanceTierValue"
        :availablePeriodCheckboxItems="availablePeriodCheckboxItems"
        :validateOtherTierNow="validateOtherTierNow"
        :validateOtherTierOnBlur="validateOtherTierOnBlur"
        :clearOtherTierValidation="clearOtherTierValidation"
        @openModal="openModal"
        @formUpdate="formComponentUpdate"
      />

      <GeneralXaaSForm 
        v-if="isGeneral"
        :generalXaaSData.sync="_serviceOfferingData"
        :firstTimeHere="firstTimeHere"
        :isClassificationDataMissing="isClassificationDataMissing"
        :isPeriodsDataMissing="isPeriodsDataMissing"
        :avlClassificationLevelObjects="avlClassificationLevelObjects"
        :singleClassificationLevelName="singleClassificationLevelName"
        :classificationRadioOptions="classificationRadioOptions"
        :classificationTooltipText="classificationTooltipText"
        :availablePeriodCheckboxItems="availablePeriodCheckboxItems"
        @openModal="openModal"
      />
  
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
import ComputeForm from "./ComputeForm.vue"
import GeneralXaaSForm from "./GeneralXaaSForm.vue";
import DatabaseForm from "./DatabaseForm.vue";

import Toast from "@/store/toast";

import { 
  Checkbox, 
  OtherServiceOfferingData,
  RadioButton,
  ToastObj,
} from "../../../../types/Global";

import ClassificationRequirements from "@/store/classificationRequirements";
import { ClassificationLevelDTO } from "@/api/models";

import { 
  buildClassificationCheckboxList, 
  buildClassificationLabel,
  createPeriodCheckboxItems,
} from "@/helpers";
import DescriptionOfWork from "@/store/descriptionOfWork";

@Component({
  components: {
    ClassificationsModal,
    ComputeForm,
    GeneralXaaSForm,
    DatabaseForm,
  }
})

export default class OtherOfferings extends Vue {
  $refs!: {
    serviceOfferingForm: Vue & {
      resetValidation: () => void;
      errorBucket: string[];
      reset: () => void;
      validate: () => boolean;
      errorBag: Record<number, boolean>;
    },
  };

  @PropSync("serviceOfferingData") public _serviceOfferingData!: OtherServiceOfferingData;
  @Prop() public isCompute!: boolean;
  @Prop() public isGeneral!: boolean;
  @Prop() public isDatabase!: boolean;
  @Prop() public isPeriodsDataMissing!: boolean;
  @Prop() public isClassificationDataMissing!: boolean;

  public firstTimeHere = false;
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

  public classificationLevelToast: ToastObj = {
    type: "success",
    message: "Classification requirements updated",
    isOpen: true,
    hasUndo: false,
    hasIcon: true,
  };

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
      this._serviceOfferingData.classificationLevel = classificationObj.sys_id;
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
    } else if (this._serviceOfferingData.classificationLevel) {
      // if the classification level that was selected was removed via the modal,
      // clear out this._serviceOfferingData.classificationLevel
      const selectedSysId = this._serviceOfferingData.classificationLevel;
      if (this.modalSelectedOptions.indexOf(selectedSysId) === -1) {
        this._serviceOfferingData.classificationLevel = "";
      }
    }

    await ClassificationRequirements.setSelectedClassificationLevels(
      this.avlClassificationLevelObjects
    );

    Toast.setToast(this.classificationLevelToast);
  }

  private createCheckboxOrRadioItems(data: ClassificationLevelDTO[], idSuffix: string) {
    idSuffix = idSuffix || "";
    return data.length > 1 ? buildClassificationCheckboxList(data, idSuffix, false, false) : [];
  }

  public async setAvailableClassificationLevels(): Promise<void> {
    this.avlClassificationLevelObjects 
      = await ClassificationRequirements.getSelectedClassificationLevels();
  }

  public async loadOnEnter(): Promise<void> {
    if (this.isCompute || this.isGeneral || this.isDatabase) {
      const otherOfferingObj = DescriptionOfWork.otherOfferingObject;
      this.firstTimeHere 
        = !otherOfferingObj.otherOfferingData || otherOfferingObj.otherOfferingData.length === 0;
    }

    // get classification levels selected in step 4 Contract Details
    this.avlClassificationLevelObjects 
      = await ClassificationRequirements.getSelectedClassificationLevels();
    // set checked items in modal to classification levels selected in step 4 Contract Details
    if (this.avlClassificationLevelObjects) {
      this.avlClassificationLevelObjects.forEach((val) => {
        this.modalSelectedOptions.push(val.sys_id || "")
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
    if (this.isCompute || this.isGeneral || this.isDatabase) {
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
    const eb = this.$refs.serviceOfferingForm.errorBag;
    this.errorBagValues = Object.values(eb);
  }

  @Watch("errorBagValues")
  public errorBagChange(): void {
    this.$nextTick(() => {
      const errorBag = Object.values(this.$refs.serviceOfferingForm.errorBag);
      this.formHasErrors = errorBag.includes(true);
    });
  }
  
  get Form(): Vue & { validate: () => boolean } {
    return this.$refs.serviceOfferingForm as Vue & { validate: () => boolean };
  }

  public async validate(): Promise<void> {
    this.$nextTick(() => {
      this.Form.validate();
    });
  }

  private setErrorMessages(): void {
    if (!this.$refs.serviceOfferingForm) {
      return;
    }
    this.errorBagValues = Object.values(this.$refs.serviceOfferingForm.errorBag);
    const formChildren = this.$refs.serviceOfferingForm.$children[0].$children;
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
          if (this.isCompute) {
            if (key === "radioButtonGroup" 
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
                    child.$children[i].errorMessages.push(`Please select at least one base 
                      or option period to specify your requirement’s duration level.`);
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
