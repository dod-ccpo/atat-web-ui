<template>
  <v-form ref="form" lazy-validation>
    <div>
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="page-header mb-3">
              Do you require a cross-domain solution (CDS)?
            </h1>

            <ATATRadioGroup
              id="needsCDSGroup"
              card="true"
              :value.sync="domainInfo.crossDomainSolutionRequired"
              :items="cdsOptions"
              :rules="[$validators.required('Please select Yes or No.')]"
              name="needsCDSGroup"
              class="mt-3 mb-8"
              width="180"
            />

            <div v-if="domainInfo.crossDomainSolutionRequired === 'YES'">
              <hr />
              <div class="copy-max-width">

                <v-row>
                  <v-col>
                    <ATATCheckboxGroup
                      id="cdsSolutions"
                      :items.sync="cdsSolutionItems"
                      textFieldAppendText="GB/month"  
                      class="mb-8 _cds-checkbox-list"
                      :hasTextFields="true"
                      groupLabelId="cdsSolutionLabel"
                      groupLabel="What type of cross-domain solution do you need?"
                      :labelWidth="240"
                      :textFieldWidth="164"
                      :value.sync="selectedCDSCheckboxItems"
                      :groupLabelHelpText="cdsSolutionLabelHelpText"
                      :rules="[
                        $validators
                        .required('Please select at least one type of cross-domain solution.')
                      ]"
                      :textfieldRules="[
                        $validators.required('Enter the approximate quantity of data/month.')
                        ]"
                      @checkboxTextfieldDataUpdate="solutionTypeDataUpdate"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="col-sm-12 col-md-6">
                    <ATATTextField 
                      id="projectedFileStreamType"
                      label="Projected file stream/type"
                      :value.sync="domainInfo.projectedFileStream"
                      :rules="[
                        $validators
                        .required('Enter a projected file stream/type')
                      ]"
                    />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <AnticipatedDurationandUsage
                      typeForUsage="cds"
                      typeForDuration="requirement"
                      :anticipatedNeedUsage.sync="
                        domainInfo.anticipatedNeedUsage"
                      :entireDuration.sync="domainInfo.entireDuration"
                      :selectedPeriods.sync="domainInfo.selectedPeriods"
                      :availablePeriodCheckboxItems="availablePeriodCheckboxItems"
                      :isPeriodsDataMissing="isPeriodsDataMissing"
                      index="0"
                    />
                  </v-col>
                </v-row>
              </div>
            </div>
            <ATATAlert
              id='removeCDSWarning'
              type='warning'
              :showIcon="false"
              v-if="showCDSWarning"
              :maxWidth='740'
            >
              <template v-slot:content>
                <p class="mb-0">
                  This action will delete the cross domain requirements that you have previously 
                  entered.
                </p>
              </template>
            </ATATAlert>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-form>
</template>
<script lang="ts">
import LoadOnEnter from "@/mixins/loadOnEnter";
import SaveOnLeave from "@/mixins/saveOnLeave";

import { Component, Mixins, Watch } from "vue-property-decorator";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import AnticipatedDurationandUsage from "@/components/DOW/AnticipatedDurationandUsage.vue";
import {
  Checkbox,
  CrossDomainSolution,
  RadioButton,
} from "../../../types/Global";
import { createPeriodCheckboxItems } from "@/helpers";
import Periods from "@/store/periods";

import ClassificationRequirements from "@/store/classificationRequirements";
import ATATAlert from "@/components/ATATAlert.vue";

@Component({
  components: {
    AnticipatedDurationandUsage,
    ATATRadioGroup,
    ATATTextField,
    ATATCheckboxGroup,
    ATATAlert
  }
})
export default class CrossDomain extends Mixins(LoadOnEnter, SaveOnLeave) {
  public isPeriodsDataMissing = false;
  public domainInfo: CrossDomainSolution = {
    crossDomainSolutionRequired: "",
    solutionType:[],
    projectedFileStream:"",
    entireDuration: "",
    anticipatedNeedUsage: "",
    selectedPeriods: []
  }

  private removeCDS = false

  public selectedCDSCheckboxItems: Checkbox[] = [];

  public availablePeriodCheckboxItems: Checkbox[] = [];

  public cdsOptions: RadioButton[] = [
    {
      id: "YesCdsSolution",
      label: "Yes",
      value: "YES",
    },
    {
      id: "NoCdsSolution",
      label: "No",
      value: "NO",
    },
  ];

  public cdsSolutionItems: Checkbox[] = [];

  public cdsSolutionLabelHelpText = `For each selection, enter the approximate quantity of 
    data that you expect to transfer between domains each month.`;

  @Watch("domainInfo.crossDomainSolutionRequired")
  public updateCDSRequired(): void {
    if(this.domainInfo.crossDomainSolutionRequired === "NO" && 
      ClassificationRequirements.cdsSolution?.cross_domain_solution_required === "YES"){
      this.removeCDS = true;
    }
  }

  @Watch("selectedCDSCheckboxItems")
  public updateSelectedCDSCheckboxItems(): void {

    const solutionTypeData: { type: string; dataQuantity: number; }[] = [];

    this.selectedCDSCheckboxItems.forEach(item => {
      const index = this.domainInfo.solutionType.findIndex(
        solutionType => solutionType.type === item.value);

      if(index > -1) {
        solutionTypeData.push(this.domainInfo.solutionType[index]);
      } else {
        const itemIndex = this.cdsSolutionItems.findIndex(
          cdsItem => cdsItem.value == item as unknown as string)
        
        const cdsSelection = this.cdsSolutionItems[itemIndex];
        solutionTypeData.push(
          { 
            type: cdsSelection.value, 
            dataQuantity: Number(cdsSelection.textfieldValue) || 0
          });
      }
    });

    this.domainInfo.solutionType = solutionTypeData;
  }

  public solutionTypeDataUpdate(data: Checkbox[]): void {
    const solutionTypeCount = data.filter(
      checkbox => checkbox.textfieldValue && checkbox.textfieldValue !== ""
    );

    const solutionTypeData: { type: string; dataQuantity: number; }[] = [];

    solutionTypeCount.forEach(checkboxObj => {
      const type = `${checkboxObj.value}`;
      const val = Number(checkboxObj.textfieldValue) || 0;
      const thisSolutionTypeObj = { type: type, dataQuantity: val };
      solutionTypeData.push(thisSolutionTypeObj);
    });

    this.domainInfo.solutionType = solutionTypeData;
  }

  public get showCDSWarning(): boolean {
    return this.removeCDS ? true: false
  }
  protected async loadOnEnter(): Promise<boolean> {
    const periods = await Periods.loadPeriods();
    this.isPeriodsDataMissing = (periods && periods.length === 0);
    this.availablePeriodCheckboxItems = await createPeriodCheckboxItems();
    const selectedClassifications = 
      await ClassificationRequirements.getSelectedClassificationLevels()
    const unclassifiedFound = selectedClassifications
      .some(classification => classification.classification === "U")
    const secretFound = selectedClassifications
      .some(classification => classification.classification === "S")
    const topSecretFound = selectedClassifications
      .some(classification => classification.classification === "TS")
    if(unclassifiedFound && secretFound && topSecretFound){
      this.cdsSolutionItems = [
        {
          id: "UtoS",
          label: "Unclassified to Secret",
          value: "U_TO_S",
          textfieldValue: "",
        },
        {
          id: "UtoTS",
          label: "Unclassified to Top Secret",
          value: "U_TO_TS",
          textfieldValue: "",
        },
        {
          id: "StoU",
          label: "Secret to Unclassified",
          value: "S_TO_U",
          textfieldValue: "",
        },
        {
          id: "StoTS",
          label: "Secret to Top Secret",
          value: "S_TO_TS",
          textfieldValue: "",
        },
        {
          id: "TStoU",
          label: "Top Secret to Unclassified",
          value: "TS_TO_U",
          textfieldValue: "",
        },
        {
          id: "TStoS",
          label: "Top Secret to Secret",
          value: "TS_TO_S",
          textfieldValue: "",
        }
      ]
    }
    else if(unclassifiedFound && secretFound){
      this.cdsSolutionItems = [
        {
          id: "UtoS",
          label: "Unclassified to Secret",
          value: "U_TO_S",
          textfieldValue: "",
        },
        {
          id: "StoU",
          label: "Secret to Unclassified",
          value: "S_TO_U",
          textfieldValue: "",
        },
      ]
    }
    else if(unclassifiedFound && topSecretFound){
      this.cdsSolutionItems = [
        {
          id: "UtoTS",
          label: "Unclassified to Top Secret",
          value: "U_TO_TS",
          textfieldValue: "",
        },
        {
          id: "TStoU",
          label: "Top Secret to Unclassified",
          value: "TS_TO_U",
          textfieldValue: "",
        },
      ]
    }
    else if( secretFound && topSecretFound) {
      this.cdsSolutionItems = [
        {
          id: "StoTS",
          label: "Secret to Top Secret",
          value: "S_TO_TS",
          textfieldValue: "",
        },
        {
          id: "TStoS",
          label: "Top Secret to Secret",
          value: "TS_TO_S",
          textfieldValue: "",
        }
      ]
    }

    const cdsSolution = await ClassificationRequirements.getCdsSolution();
    if(cdsSolution){
      this.domainInfo.anticipatedNeedUsage = cdsSolution.anticipated_need_or_usage;
      this.domainInfo.crossDomainSolutionRequired = cdsSolution.cross_domain_solution_required;
      this.domainInfo.entireDuration = cdsSolution.need_for_entire_task_order_duration;
      this.domainInfo.projectedFileStream = cdsSolution.projected_file_stream_type;
      this.domainInfo.selectedPeriods = cdsSolution.selected_periods 
        ? cdsSolution.selected_periods.split(",") : [];

      const solutionTypes: { type: string; dataQuantity: number; }[]
       = JSON.parse(cdsSolution.traffic_per_domain_pair);

      if(solutionTypes){
        const checkboxItems: any = [];
        const savedSolutionsTypes: any = [];
        solutionTypes.forEach(item => {
          const checkBoxItemIndex = this.cdsSolutionItems.findIndex(
            cbItem => cbItem.value === item.type);

          if(checkBoxItemIndex > -1){
            this.cdsSolutionItems[
              checkBoxItemIndex].textfieldValue = item.dataQuantity.toString();
            savedSolutionsTypes.push({"type":item.type,"dataQuantity":item.dataQuantity})
            checkboxItems.push(item.type);
          }
        });
        
        this.$nextTick(() => {
          this.selectedCDSCheckboxItems = checkboxItems;
          this.domainInfo.solutionType = savedSolutionsTypes;
        });
      }
    }

    return true;
  }


  protected async saveOnLeave(): Promise<boolean> {
    if(this.removeCDS){
      await ClassificationRequirements.removeCdsSolution()
    }else{
      await ClassificationRequirements.setCdsSolution(this.domainInfo);
    }
    return true;
  }
}
</script>

