
<template>
  <div class="mb-7">
    <v-form ref="form" lazy-validation>
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="page-header mb-3">
              Do you need to include packaging, packing, or shipping instructions?
            </h1>
            <div class="copy-max-width">
              <p class="mb-10" id="IntroP">
                This is not common for most cloud computing acquisitions. However, 
                you may have a situation, like Tactical Edge device delivery, 
                instructional materials in support of training, or physical data 
                transfer services where you need to transfer data on hard drives 
                to a CSP.            
              </p>
              <p id="SelectMessage">
                Select all that apply to your contracting effort.
              </p>
            </div>
            <ATATCheckboxGroup
              :key="selectedOptions.toString()"
              id="PackagingEtcCheckboxes"
              ref="PackagingEtcCheckboxesRef"
              :value="selectedOptions"
              @update:value="selectedOptions = $event"
              :hasOtherValue="true"
              :otherValue="otherValue"
              :otherValueEntered="otherValueEntered"
              @update:otherValueEntered="otherValueEntered = $event"
              :otherValueRequiredMessage="otherValueRequiredMessage"
              :noneValue="noneApplyValue"
              :items="checkboxItems"
              otherEntryType="textarea"

              name="checkboxes"
              :card="false"
              class="copy-max-width"
              :rules="[
                $validators.required('Please select an option.')
              ]"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>
<script lang="ts">
/* eslint-disable camelcase */
import { Component, Watch, Vue, toNative, Hook } from "vue-facing-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";

import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import { ContractConsiderationsDTO } from "@/api/models";
import { Checkbox, SaveOnLeaveRefs } from "types/Global";
import { hasChanges } from "@/helpers";
import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATCheckboxGroup,
  }
})

class PackagingPackingAndShipping extends Vue {
 
  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs,
      nextTick: this.$nextTick,
    }).catch()
  }
  public otherValueRequiredMessage 
    = "Please enter your packaging, packing and shipping instructions."
  
  public contractorProvidedTransportValue = "CONTRACTOR_PROVIDED";
  public otherValue = "OTHER";
  public noneApplyValue = "NONE";

  public selectedOptions: string[] = [];
  public otherValueEntered = "";
  public contractorProvidedTransportSelected = "";
  public otherSelected = "";
  public noneApplySelected = "";

  private checkboxItems: Checkbox[] = [
    {
      id: "ContractorProvided",
      label: `When transferring physical media between locations, the 
        contractor shall provide a certified courier or other method of 
        maintaining a secure chain of custody over tapes and other media being 
        moved to and from a defined, secured off-site storage location. The 
        contractor shall provide flexibility in courier pick-up and delivery 
        time.`,
      value: this.contractorProvidedTransportValue, 
      description: "",
    },
    {
      id: "Other",
      label: "Other - Write custom instructions",
      value: this.otherValue,
      description: "",
    },
    {
      id: "NoneApply",
      label: "None of these apply to my acquisition.",
      value: this.noneApplyValue,
      description: "",
    },    
  ];

  @Watch("selectedOptions", {deep: true})
  public selectedOptionsChange(newVal: string[]): void {
    this.noneApplySelected = newVal.indexOf(this.noneApplyValue) > -1 ? "true" : "false";
    this.otherSelected = newVal.indexOf(this.otherValue) > -1 ? "true" : "false";
    this.contractorProvidedTransportSelected 
      = newVal.indexOf(this.contractorProvidedTransportValue) > -1 ? "true" : "false";
  }

  public get currentData(): ContractConsiderationsDTO {
    return {
      contractor_provided_transfer: this.contractorProvidedTransportSelected,
      packaging_shipping_other: this.otherSelected,
      packaging_shipping_other_explanation: this.otherValueEntered,
      packaging_shipping_none_apply: this.noneApplySelected,
      acquisition_package:AcquisitionPackage.packageId
    };
  }
  
  private savedData: ContractConsiderationsDTO = {};

  public async loadOnEnter(): Promise<void> {
    const storeData = await AcquisitionPackage.loadData<ContractConsiderationsDTO>({
      storeProperty: StoreProperties.ContractConsiderations
    });
    
    if (storeData) {
      this.savedData = {
        contractor_provided_transfer: storeData.contractor_provided_transfer,
        packaging_shipping_other: storeData.packaging_shipping_other, 
        packaging_shipping_other_explanation: storeData.packaging_shipping_other_explanation,
        packaging_shipping_none_apply: storeData.packaging_shipping_none_apply
      }

      if (this.savedData.contractor_provided_transfer === "true")
        this.selectedOptions.push(this.contractorProvidedTransportValue)

      if (this.savedData.packaging_shipping_other === "true")
        this.selectedOptions.push(this.otherValue)

      if (this.savedData.packaging_shipping_none_apply === "true")
        this.selectedOptions.push(this.noneApplyValue)

      this.otherValueEntered = this.savedData.packaging_shipping_other_explanation as string;
    } else {
      AcquisitionPackage.setCurrentContract(this.currentData);
    }
  }

  public isChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    await AcquisitionPackage.setValidateNow(true);

    if (this.noneApplySelected === "true" || this.otherSelected !== "true") {
      this.otherValueEntered = "";
    }
    try {
      if (this.isChanged()) {
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

export default toNative(PackagingPackingAndShipping)
</script>
