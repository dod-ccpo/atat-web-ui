<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-form ref="form" lazy-validation>
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
              ref="CheckboxGroupRef"
              aria-describedby="CheckboxGroupLabel"
              :value="selectedOptions"
              @update:value="selectedOptions = $event"
              :items="checkboxItems"
              :card="false"
              class="copy-max-width"
              :hasOtherValue="true"
              :otherValue="otherValue"
              :otherValueEntered="otherValueEntered"
              @update:otherValueEntered="otherValueEntered = $event"
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
            ref="OtherOfferingsRef"
            :otherOfferingList="otherOfferingList"
            :serviceOfferingData="otherOfferingData"
            @update:serviceOfferingData="otherOfferingData = $event"
            :isPeriodsDataMissing="isPeriodsDataMissing"
            :isClassificationDataMissing="isClassificationDataMissing"
            :portabilityClassificationLevels="portabilityClassificationLevels"
            @update:portabilityClassificationLevels="portabilityClassificationLevels = $event"
          />
        </v-col>
        </v-form>
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
/*eslint prefer-const: 1 */
import { Component, Watch, Vue, toNative, Hook } from "vue-facing-decorator";

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
  SaveOnLeaveRefs,
} from "../../../../types/Global";
import { getIdText } from "@/helpers";
import { beforeRouteLeaveFunction, From, To } from "@/mixins/saveOnLeave";
import AcquisitionPackage from "@/store/acquisitionPackage";
 

@Component({
  components: {
    ATATCheckboxGroup,
    DOWSubtleAlert,
    OtherOfferings,
    DeleteOfferingModal,
  }
})

class ServiceOfferings extends Vue{
    
  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs, 
      nextTick: this.$nextTick,
    }).catch()
  }
  // requirementName will be pulled from data in future ticket
  public requirementName = "";

  get requiredMessage():string{
    return `Please select at least one type of offering. If you 
    no longer need ${this.requirementName},<br />select the “I don't need 
    these cloud resources” button below.`;
  }

  public otherValueRequiredMessage = "Please enter a title for this requirement."
  public otherValue = "Other";
  public otherValueEntered = "";
  public otherSelected = "";

  public showDialog = false;
  public previousSelectedOptions: string[] = [];
  public deselectedLabel = "";
  public deleteMode = "item";
  portabilityClassificationLevels: string[] = [];

  @Watch("selectedOptions")
  public async selectedOptionsChange(newVal: string[]): Promise<void> {
    if(this.previousSelectedOptions.length > this.selectedOptions.length){
      const difference = this.previousSelectedOptions.filter(
        tempVal => this.selectedOptions.indexOf(tempVal) === -1
      );
      const deselectedItem = this.checkboxItems.find(el => el.value === difference[0]);
      this.deselectedLabel = deselectedItem?.label || "";
      this.deleteMode = "item";
      if(this.deselectedLabel === "Other"){
        this.otherValueEntered = ""
      }
      const hasInstances = 
        await DescriptionOfWork.serviceOfferingHasInstances(this.deselectedLabel);
      if (hasInstances) {
        this.openModal();
      }
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
      if(this.serviceGroupOnLoad === "PORTABILITY_PLAN"){
        this.portabilityClassificationLevels = []
      }
      await DescriptionOfWork.removeCurrentOfferingGroup();
      DescriptionOfWork.setConfirmServiceOfferingDelete(false);
      this.showDialog = false;
      this.deleteMode = "item";
      this.deselectedLabel = "";
      this.$router.push({
        name: "pathResolver",
        query: {
          resolver: "ServiceOfferingsPathResolver",
          direction: "next"
        },
      }).catch(() => console.log("avoiding redundant navigation"));
    } else {
      await DescriptionOfWork.removeServiceOffering(this.deselectedLabel);
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

  public otherOfferingData: OtherServiceOfferingData| OtherServiceOfferingData[] =
    _.cloneDeep(DescriptionOfWork.emptyOtherOfferingInstance);

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
          if (checkboxItem.label === "Other") {
            this.otherValueEntered = offering.otherOfferingName || "";
          }
          this.checkboxItems.push(checkboxItem);
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

    } else {
      const offeringIndex = DescriptionOfWork.DOWObject.findIndex(
        obj => obj.serviceOfferingGroupId.toLowerCase() 
          === DescriptionOfWork.currentGroupId.toLowerCase()
      );
      if (offeringIndex > -1) {
        const otherOfferingDataArray = 
          DescriptionOfWork.DOWObject[offeringIndex].otherOfferingData;
        if (otherOfferingDataArray && otherOfferingDataArray.length > 0) {
          let otherOfferingData :OtherServiceOfferingData|OtherServiceOfferingData[]|undefined
          const currentInstanceNumber = DescriptionOfWork.currentOtherServiceInstanceNumber;
          if(this.requirementName === 'Portability plan'){
            otherOfferingData = otherOfferingDataArray
            otherOfferingData.forEach(offering=>{
              if(offering.classificationLevel){
                this.portabilityClassificationLevels.push(offering.classificationLevel)
              }
            })
          }else{
            otherOfferingData = otherOfferingDataArray.find(
              obj => obj.instanceNumber === currentInstanceNumber
            );
          }
          if (otherOfferingData) {
            this.otherOfferingData = otherOfferingData;
          } else {
            const newOtherOfferingData
              = await DescriptionOfWork.getOtherOfferingInstance(0);
            newOtherOfferingData.instanceNumber = currentInstanceNumber;
            this.otherOfferingData = newOtherOfferingData;
          }
        } else {
          if(Array.isArray(this.otherOfferingData)){
            this.otherOfferingData.forEach(offering => offering.instanceNumber = 1)
          }else{
            this.otherOfferingData.instanceNumber = 1;
          }
          DescriptionOfWork.setCurrentOtherOfferingInstanceNumber(1);
        }
      }
    }
    //find sys_id for otherValue
    const otherCheckBoxIndex = this.checkboxItems.findIndex((item) =>item.label === "Other")
    this.otherValue = this.checkboxItems[otherCheckBoxIndex]?.value || ""

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
    await AcquisitionPackage.setValidateNow(true)
    try {
      if (this.serviceGroupOnLoad) {
        // save to store if user hasn't clicked "I don't need these cloud resources" button
        if (this.serviceGroupOnLoad === DescriptionOfWork.currentGroupId) {
          if (this.isServiceOfferingList) {
            await DescriptionOfWork.setSelectedOfferings(
              { selectedOfferingSysIds: this.selectedOptions, otherValue: this.otherValueEntered }
            );
          } else {
            // this will be restored and made more bulletproof as it does kill the app
            // if (this.otherOfferingData.sysId !== ""){
            //   await this.prepareCurrentOfferingToSave();
            // }
            if(this.requirementName === 'Portability plan'){
              //first time coming through
              if(!Array.isArray(this.otherOfferingData)){
                this.otherOfferingData = []
                this.portabilityClassificationLevels.forEach(cl=>{
                  let instanceNumber = 1
                  if(Array.isArray(this.otherOfferingData)){
                    instanceNumber = this.otherOfferingData.length + 1
                  }
                  const portabilityObj =
                    // eslint-disable-next-line max-len
                    Object.assign(_.cloneDeep(DescriptionOfWork.emptyOtherOfferingInstance),{classificationLevel:cl, instanceNumber})
                  if(Array.isArray(this.otherOfferingData)){
                    this.otherOfferingData.push(portabilityObj)
                  }
                })
              }
              //on edit
              if(Array.isArray(this.otherOfferingData)){
                //remove classification
                this.otherOfferingData.forEach((data, idx)=>{
                  if(data.classificationLevel){
                    const found = this.portabilityClassificationLevels
                      .includes(data.classificationLevel)
                    if(!found && Array.isArray(this.otherOfferingData)){
                      DescriptionOfWork
                        .deleteOtherOfferingInstance(this.otherOfferingData[idx].instanceNumber)
                    }
                  }
                })
                // on edit adding a classification
                this.portabilityClassificationLevels.forEach(cl=>{
                  if(Array.isArray(this.otherOfferingData)) {
                    const found = this.otherOfferingData
                      .some(offering => offering.classificationLevel === cl)
                    if(!found){
                      const instanceNumber = this.otherOfferingData.length + 1
                      const portabilityObj =
                        // eslint-disable-next-line max-len
                        Object.assign(_.cloneDeep(DescriptionOfWork.emptyOtherOfferingInstance),{classificationLevel:cl, instanceNumber})
                      if(Array.isArray(this.otherOfferingData)){
                        this.otherOfferingData.push(portabilityObj)
                      }
                    }
                  }
                })
                if(this.portabilityClassificationLevels.length){
                  for(const offering of this.otherOfferingData){
                    offering.isComplete = true;
                    await DescriptionOfWork.setOtherOfferingData(offering);
                  }
                }
              }
            }else{
              if(!Array.isArray(this.otherOfferingData)){
                await DescriptionOfWork.setOtherOfferingData(this.otherOfferingData);
              }
            }
          }
        }
      }
    } catch (error) {
      throw new Error('error saving requirement data');
    }

    return true;
  }

  /**
   * The function prepares the current offering to save ONLY if the user deleted the classification
   * level of the offering.
   * 
   * if the user removes the classification level on the instance currently being viewed,
   * the instance is deleted from the store and the database, but the form fields remain filled in
   * and the user remains on the page.
   * 
   * By removing the sys_id of this.otherOfferingData obj, the instance will successfully save to 
   * the database and store and a new instance will be created. 
   */
  public async prepareCurrentOfferingToSave(): Promise<void> {
    const existingOtherOfferings: OtherServiceOfferingData[] = [];
    DescriptionOfWork.DOWObject.forEach(
      (dow) => {
        if(dow.otherOfferingData !== undefined) {
          dow.otherOfferingData.forEach(
            ood => existingOtherOfferings.push(ood)
          )
        }
      }
    )

    if(!Array.isArray(this.otherOfferingData)){
      const displayedOtherOfferingHasNoClassLevel = existingOtherOfferings.some(
        others => others.sysId !== (this.otherOfferingData as OtherServiceOfferingData).sysId
      )

      if (displayedOtherOfferingHasNoClassLevel){
        this.otherOfferingData.sysId = "";
      }
    }

  }

}
export default toNative(ServiceOfferings)
</script>
