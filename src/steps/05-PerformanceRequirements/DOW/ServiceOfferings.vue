<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col
          v-if="isServiceOfferingList"
          class="col-12"
          @AdditionalButtonClicked="deleteServiceOfferingCategory"
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
        
        <v-col v-else-if="!isServiceOfferingList">
          <OtherOfferings 
            :otherOfferingList="otherOfferingList"
            :serviceOfferingData.sync="otherOfferingData" 
            :isPeriodsDataMissing="isPeriodsDataMissing"
            :isClassificationDataMissing="isClassificationDataMissing"
          />
        </v-col>

      </v-row>
    </v-container>

    <DeleteOfferingModal
      :showDialog="showDialog"
      :requirementName="requirementName"
      :offeringName="deselectedLabel"
      :deleteMode="deleteMode"
      @deleteOfferingCancelClicked="modalCancelClicked"
      @deleteOfferingOkClicked="deleteServiceItem"
    >
    </DeleteOfferingModal>

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
import DeleteOfferingModal from "./DeleteOfferingModal.vue";

import _ from "lodash";

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
    DeleteOfferingModal,
  }
})

export default class ServiceOfferings extends Mixins(SaveOnLeave) {
  // requirementName will be pulled from data in future ticket
  public requirementName = "";

  public requiredMessage = `Please select at least one type of offering. If you 
    no longer need ${this.requirementName}, select the “I don't need 
    these cloud resources” button below.`;

  public otherValueRequiredMessage = "Please enter a title for this requirement."
  public otherValue = "Other";
  public otherValueEntered = "";
  public otherSelected = "";

  public showDialog = false;
  public previousSelectedOptions: string[] = [];
  public deselectedLabel = "";
  public deleteMode = "item";

  @Watch("selectedOptions")
  public selectedOptionsChange(newVal: string[]): void {
    if(this.previousSelectedOptions.length > this.selectedOptions.length){
      const difference = this.previousSelectedOptions.filter(
        tempVal => this.selectedOptions.indexOf(tempVal) === -1
      );
      const deselectedItem = this.checkboxItems.find(el => el.value === difference[0]);
      this.deselectedLabel = deselectedItem?.label || "";
      this.deleteMode = "item";
      // todo: need to check if service offering has saved data or if is first
      // time checking the offering checkbox. If first time (i.e., no saved data
      // for the offering), then no need to show the delete confirmation modal
      this.openModal();
    }
    
    this.otherSelected = newVal.indexOf(this.otherValue) > -1 ? "true" : "false";
    this.previousSelectedOptions = this.selectedOptions.slice();
  }

  get confirmOfferingDelete(): boolean {
    return DescriptionOfWork.confirmServiceOfferingDeleteVal;
  }

  @Watch("confirmOfferingDelete")
  public deleteServiceOfferingCategory(newVal: boolean): void {
    if(newVal){
      this.deleteMode = "category";
      this.openModal();
    } 
  }

  public openModal(): void {
    this.showDialog = true;
  }

  public async modalCancelClicked(): Promise<void> {
    const deselectedItem = this.checkboxItems.find(el => el.label === this.deselectedLabel);
    if(deselectedItem)
      this.selectedOptions.push(deselectedItem?.value);
    this.showDialog = false;
    await DescriptionOfWork.setConfirmServiceOfferingDelete(false);
  }

  public async deleteServiceItem(): Promise<void> {
    if(this.deleteMode === "category"){
      await DescriptionOfWork.removeCurrentOfferingGroup();
      DescriptionOfWork.setConfirmServiceOfferingDelete(false);
      this.showDialog = false;
      this.deleteMode = "item";
      this.deselectedLabel = "";
      this.$router.push({
        name: "pathResolver",
        params: {
          resolver: "OfferGroupOfferingsPathResolver",
          direction: "next"
        },
      }).catch(() => console.log("avoiding redundant navigation"));
    } else {
      this.showDialog = false;
      this.deleteMode = "item";
      this.deselectedLabel = "";
    }
    
  }

  public selectedOptions: string[] = [];
  private checkboxItems: Checkbox[] = [];
  public serviceOfferings: DOWServiceOffering[] = [];
  public serviceGroupOnLoad = "";

  public otherOfferingList = [
    "compute",
    "database",
    "storage",
    "general_xaas",
    "advisory_assistance",
    "help_desk_services",
    "training",
    "documentation_support",
    "general_cloud_support",
    "portability_plan"
  ];

  public isServiceOfferingList = true;

  public otherOfferingData = _.cloneDeep(DescriptionOfWork.emptyOtherOfferingInstance);

  public showSubtleAlert = false;
  public isPeriodsDataMissing = false;
  public isClassificationDataMissing = false;

  public async loadOnEnter(): Promise<void> {
    this.serviceGroupOnLoad = DescriptionOfWork.currentGroupId;

    // all other categories have a similar workflow with checkbox list of service offerings
    this.isServiceOfferingList = !this.otherOfferingList.includes(
      this.serviceGroupOnLoad.toLowerCase()
    );

    this.requirementName = await DescriptionOfWork.getOfferingGroupName();

    if (this.isServiceOfferingList) {
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

      const selectedOfferings = DescriptionOfWork.selectedServiceOfferings;
      
      const validSelections = selectedOfferings.reduce<string[]>((accumulator, current)=>{  
        const itemIndex = this.checkboxItems.findIndex(item=>item.label === current);
        const selected = itemIndex >=0 ? [...accumulator, 
          this.checkboxItems[itemIndex].value] : accumulator;
        return selected;
      }, []);

      this.selectedOptions.push(...validSelections);

      this.otherValueEntered = DescriptionOfWork.otherServiceOfferingEntry;
    } else {
      const offeringIndex = DescriptionOfWork.DOWObject.findIndex(
        obj => obj.serviceOfferingGroupId.toLowerCase() 
          === DescriptionOfWork.currentGroupId.toLowerCase()
      );
      if (offeringIndex > -1) {
        const otherOfferingDataArray = 
          DescriptionOfWork.DOWObject[offeringIndex].otherOfferingData;
        if (otherOfferingDataArray && otherOfferingDataArray.length > 0) {
          const currentInstanceNumber = DescriptionOfWork.currentOtherServiceInstanceNumber;
          const otherOfferingData = otherOfferingDataArray.find(
            obj => obj.instanceNumber === currentInstanceNumber
          );
          if (otherOfferingData) {
            this.otherOfferingData = otherOfferingData;
          } else {
            const newOtherOfferingData 
              = await DescriptionOfWork.getOtherOfferingInstance(0);
            newOtherOfferingData.instanceNumber = currentInstanceNumber;
            this.otherOfferingData = newOtherOfferingData;
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

    this.previousSelectedOptions = this.selectedOptions.slice();
    await DescriptionOfWork.setConfirmServiceOfferingDelete(false);
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
          } else {
            await DescriptionOfWork.setOtherOfferingData(this.otherOfferingData);
          }
        }
      }
    } catch (error) {
      throw new Error('error saving requirement data');
    }

    return true;
  }

}

</script>
