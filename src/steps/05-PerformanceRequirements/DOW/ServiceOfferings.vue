<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col
          v-if="isServiceOfferingList"
          class="col-12"
        >
          <h1 
            class="page-header"
            :class="{'mb-4' : showSubtleAlert}"
          >
            What type of {{ requirementName }} do you need?
          </h1>
          <div class="copy-max-width">
            <DOWSubtleAlert
              v-show="showSubtleAlert"
              :isClassificationDataMissing="isClassificationDataMissing"
              :isPeriodsDataMissing="isPeriodsDataMissing"
            />
            <p id="CheckboxGroupLabel">
              Select all that apply to your contracting effort.
            </p>

            <ATATCheckboxGroup
              id="CheckboxGroup"
              aria-describedby="CheckboxGroupLabel"
              :value.sync="selectedOptions"
              :items="checkboxItems"
              :card="false"
              class="copy-max-width"
              :hasOtherValue="true"
              :otherValue="otherValue"
              :otherValueEntered.sync="otherValueEntered"
              :otherValueRequiredMessage="otherValueRequiredMessage"
              otherEntryType="textfield"
              :rules="[
                $validators.required(requiredMessage)
              ]"
            />

          </div>
        </v-col>
        
        <v-col v-else-if="isCompute || isGeneral">
          <OtherOfferings 
            :isCompute="isCompute"
            :isGeneral="isGeneral"
            :serviceOfferingData.sync="otherOfferingData" 
            :isPeriodsDataMissing="isPeriodsDataMissing"
            :isClassificationDataMissing="isClassificationDataMissing"
          />
        </v-col>

      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import SaveOnLeave from "@/mixins/saveOnLeave";
import { Component, Mixins, Watch } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import OtherOfferings from "./OtherOfferings.vue";
import DescriptionOfWork from "@/store/descriptionOfWork";
import Periods from "@/store/periods";
import classificationRequirements from "@/store/classificationRequirements";

import DOWSubtleAlert from "./DOWSubtleAlert.vue";

import { 
  Checkbox, 
  OtherServiceOfferingData, 
  DOWServiceOffering, 
} from "../../../../types/Global";
import { getIdText } from "@/helpers";

@Component({
  components: {
    ATATCheckboxGroup,
    DOWSubtleAlert,
    OtherOfferings,
  }
})

export default class ServiceOfferings extends Mixins(SaveOnLeave) {
  // requirementName will be pulled from data in future ticket
  public requirementName = "";

  public requiredMessage = `Please select at least one type of offering. If you 
    no longer need ${this.requirementName}, select the “I don’t need 
    these cloud resources” button below.`;

  public otherValueRequiredMessage = "Please enter a title for this requirement."
  public otherValue = "Other";
  public otherValueEntered = "";
  public otherSelected = "";

  @Watch("selectedOptions")
  public selectedOptionsChange(newVal: string[]): void {
    this.otherSelected = newVal.indexOf(this.otherValue) > -1 ? "true" : "false";
  }

  public selectedOptions: string[] = [];
  private checkboxItems: Checkbox[] = [];
  public serviceOfferings: DOWServiceOffering[] = [];
  public serviceGroupOnLoad = "";

  public isCompute = false;
  public isGeneral = false;
  public isServiceOfferingList = true;

  public otherOfferingData: OtherServiceOfferingData = {
    instanceNumber: 1,
    environmentType: "",
    classificationLevel: "",
    deployedRegions: [],
    deployedRegionsOther: "",
    descriptionOfNeed: "",
    entireDuration: "",
    periodsNeeded: [],
    operatingSystemAndLicensing: "",
    numberOfVCPUs: "",
    memory: "",
    storageType: "",
    storageAmount: "",
    performanceTier: "",
    performanceTierOther: "",
    numberOfInstancesNeeded: "1",
    requirementTitle: "",
  }

  public showSubtleAlert = false;
  public isPeriodsDataMissing = false;
  public isClassificationDataMissing = false;

  public async loadOnEnter(): Promise<void> {
    this.serviceGroupOnLoad = DescriptionOfWork.currentGroupId;
    // only Compute and General XaaS categories differ in requirements
    this.isCompute = this.serviceGroupOnLoad.toLowerCase() === "compute";
    this.isGeneral = this.serviceGroupOnLoad.toLowerCase() === "general_xaas";
    // all other categories have a similar workflow with checkbox list of service offerings
    this.isServiceOfferingList = !this.isCompute && !this.isGeneral;

    if (this.isServiceOfferingList) {
      this.requirementName = await DescriptionOfWork.getOfferingGroupName();
      this.serviceOfferings = await DescriptionOfWork.getServiceOfferings();
      if (this.serviceOfferings.length) {
        this.serviceOfferings.forEach((offering) => {
          const checkboxItem: Checkbox = {
            id: getIdText(offering.name),
            label: offering.name,
            value: offering.sys_id,
            description: offering.description,
          }
          this.checkboxItems.push(checkboxItem);
          if (checkboxItem.value === "Other") {
            this.otherValueEntered = offering.otherOfferingName || "";
          }
        });
      }

      this.requirementName = await DescriptionOfWork.getOfferingGroupName();

      const selectedOfferings = DescriptionOfWork.selectedServiceOfferings;
      
      const validSelections = selectedOfferings.reduce<string[]>((accumulator, current)=>{  
        const itemIndex = this.checkboxItems.findIndex(item=>item.label === current);
        const selected = itemIndex >=0 ? [...accumulator, 
          this.checkboxItems[itemIndex].value] : accumulator;
        return selected;
      }, []);

      this.selectedOptions.push(...validSelections);

      this.otherValueEntered = DescriptionOfWork.otherServiceOfferingEntry;
    } else if (this.isCompute) {
      const computeIndex = DescriptionOfWork.DOWObject.findIndex(
        obj => obj.serviceOfferingGroupId.toLowerCase() === "compute"
      );
      if (computeIndex > -1) {
        const computeDataArray = DescriptionOfWork.DOWObject[computeIndex].otherOfferingData;
        if (computeDataArray && computeDataArray.length > 0) {
          const currentInstanceNumber = DescriptionOfWork.currentOtherServiceInstanceNumber;
          const computeData = computeDataArray.find(
            obj => obj.instanceNumber === currentInstanceNumber
          );
          if (computeData) {
            this.otherOfferingData = computeData;
          } else {
            const newComputeData 
              = await DescriptionOfWork.getOtherOfferingInstance(0);
            newComputeData.instanceNumber = currentInstanceNumber;
            this.otherOfferingData = newComputeData;
          }
        } else {
          this.otherOfferingData.instanceNumber = 1;
          DescriptionOfWork.setCurrentOtherOfferingInstanceNumber(1);
        }
      }
    }

    const periods = await Periods.loadPeriods();
    const classifications = await classificationRequirements.getSelectedClassificationLevels();
    this.isPeriodsDataMissing = periods.length === 0 ? true : false;
    this.isClassificationDataMissing = classifications.length === 0 ? true : false;
    this.showSubtleAlert = this.isPeriodsDataMissing || this.isClassificationDataMissing;
  } 

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.serviceGroupOnLoad) {
        // save to store if user hasn't clicked "I don't need these cloud resources" button
        if (this.serviceGroupOnLoad === DescriptionOfWork.currentGroupId) {
          if (this.isServiceOfferingList) {
            await DescriptionOfWork.setSelectedOfferings(
              { selectedOfferingSysIds: this.selectedOptions, otherValue: this.otherValueEntered }
            );
          } else if (this.isCompute || this.isGeneral) {
            await DescriptionOfWork.setOtherOfferingData(this.otherOfferingData);
          }
        }

        //save to backend
        if (this.isServiceOfferingList) {
          await DescriptionOfWork.saveUserSelectedServices();
        } else if (this.isCompute) {
          // save computeData to backend in ticket AT-7767
        }
      }
    } catch (error) {
      throw new Error('error saving requirement data');
    }

    return true;
  }

}

</script>
