<template>
  <v-form ref="form" lazy-validation>
    <div class="mb-7">
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="page-header">
              Which contract type(s) apply to this acquisition?
            </h1>
            <div class="copy-max-width">
              <p class="mb-10" id="IntroP">
                Firm-fixed-price (FFP) is the standard contract type for JWCC task orders. 
                For JWCC, consumption-based line items are considered FFP. You must provide 
                justification for a time-and-material (T&M) or hybrid contract, in accordance 
                with 
                <a 
                  href="https://www.acquisition.gov/far/12.207" 
                  target="_blank"
                  class="_text-link"
                >
                  <span class="_external-link">FAR 12.207.</span>
                </a>
                If you are considering a T&amp;M contract, we suggest contacting your 
                Contracting Office for further guidance.          
              </p>
              <p id="SelectMessage">
                Select all that apply to your contracting effort.
              </p>
            <ATATCheckboxGroup
              id="ContractTypesCheckboxes"
              :value.sync="selectedContractTypes"
              :items="checkboxItems"
              name="checkbox-card"
              :card="true"
              class="max-width-500"
              :rules="[
                $validators.required('Please select at least one contract type')
              ]"
            />
            </div>

            <div v-if="hasTM" id="JustificationEntry" class="max-width-740">
              <hr />
              <ATATTextArea
                id="JustificationForTM"
                :value.sync="justification"
                label="Please provide justification for your T&amp;M contract type."
                helpText="Briefly describe why the duration of work and/or costs cannot 
                  be reasonably estimated and what control measures will be taken to 
                  monitor contractor performance and costs in labor. 
                  <a role='button' id='JustificationLearnMore'>Learn more</a>"
                maxChars="2000"
                :rules="[
                  $validators.required(
                    'Please provide justification for your T&M contract selection.'
                  )
                ]"
              />
            </div>

          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-form>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins, Watch } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";

import { Checkbox } from "../../../types/Global";
import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { ContractTypeDTO } from "@/api/models"
import { hasChanges } from "@/helpers";
import IGCE  from "@/store/IGCE";

@Component({
  components: {
    ATATCheckboxGroup,
    ATATTextArea,
  },
})

export default class ContractType extends Mixins(SaveOnLeave) {
  private firmFixedPriceSelected = "";
  private timeAndMaterialsSelected = "";
  
  private selectedContractTypes: string[] = [];

  @Watch("selectedContractTypes")
  protected selectedContractTypesChanged(newSelections: string[]): void {
    this.firmFixedPriceSelected = newSelections.indexOf("FFP") > -1 ? "true" : "false";
    this.timeAndMaterialsSelected = newSelections.indexOf("T&M") > -1 ? "true" : "false";
  }

  @Watch("timeAndMaterialsSelected")
  protected selectedTMChanged(newVal: string): void {
    if (newVal === "false") {
      this.justification = "";
    }
  }

  public get hasTM(): boolean {
    return this.selectedContractTypes.indexOf("T&M") > -1;
  }

  private justification = "";
  private checkboxItems: Checkbox[] = [
    {
      id: "FFPCheckbox",
      label: "Firm-fixed-price (FFP)",
      value: "FFP",
      description: `<v-chip class="v-chip v-chip--label theme--light v-size--default bg-info-dark
        mr-2"><span class="v-chip__content">Recommended</span></v-chip><span class="font-size-14 
        text-base">Standard contract type</span>`,
    },
    {
      id: "TMCheckbox",
      label: "Time-and-material (T&M)",
      value: "T&M",
      description: "A justification is required for any contract line item other than travel.",
    }
  ];

  private get currentData(): ContractTypeDTO {
    return {
      firm_fixed_price: this.firmFixedPriceSelected,
      time_and_materials: this.timeAndMaterialsSelected,
      contract_type_justification: this.justification,
    };
  }

  private savedData: ContractTypeDTO = { 
    firm_fixed_price: "",
    time_and_materials: "",
    contract_type_justification: "",
  };

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await AcquisitionPackage
      .loadData<ContractTypeDTO>({storeProperty: StoreProperties.ContractType});

    if (storeData) {
      if (Object.prototype.hasOwnProperty.call(storeData, 'firm_fixed_price')) {
        this.savedData = {
          firm_fixed_price: storeData.firm_fixed_price,
          time_and_materials: storeData.time_and_materials,
          contract_type_justification: storeData.contract_type_justification,
        }
        this.firmFixedPriceSelected = storeData.firm_fixed_price;
        this.timeAndMaterialsSelected = storeData.time_and_materials;
        this.justification = storeData.contract_type_justification;

        if (this.firmFixedPriceSelected === "true") {
          this.selectedContractTypes.push("FFP");
        }
        if (this.timeAndMaterialsSelected === "true") {
          this.selectedContractTypes.push("T&M");
        }
        
      }
    } else {
      AcquisitionPackage.setContractType(this.currentData);
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    await AcquisitionPackage.setValidateNow(true);

    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.saveData<ContractTypeDTO>({data: this.currentData, 
          storeProperty: StoreProperties.ContractType});
        await IGCE.updateIgceEstimateRecordWithContractType();
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }

}
</script>
