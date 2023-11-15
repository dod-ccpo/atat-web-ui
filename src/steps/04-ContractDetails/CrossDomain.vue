<template>
  <v-form ref="form" lazy-validation>
    <div>
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="page-header">
              Do you require a cross-domain solution (CDS)?
            </h1>

            <ATATRadioGroup
              id="needsCDSGroup"
              ref="needsCDSGroup"
              card="true"
              :value="domainInfo.crossDomainSolutionRequired"
              @update:value="domainInfo.crossDomainSolutionRequired = $event"
              :items="cdsOptions"
              :rules="[$validators.required('Please select an option.')]"
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
                      ref="cdsSolutions"
                      :items="cdsSolutionItems"
                      @update:items="cdsSolutionItems = $event"
                      textFieldAppendText="GB/month"  
                      class="mb-8 _cds-checkbox-list"
                      :hasTextFields="true"
                      groupLabelId="cdsSolutionLabel"
                      groupLabel="What type of cross-domain solution do you need?"
                      :labelWidth="240"
                      :textFieldWidth="164"
                      :value="selectedCDSCheckboxItems"
                      @update:value="selectedCDSCheckboxItems = $event"
                      :groupLabelHelpText="cdsSolutionLabelHelpText"
                      :rules="[
                        $validators
                        .required('Please select at least one type of cross-domain solution.')
                      ]"
                      :textfieldRules="[
                        $validators.required(
                          'Enter the number of GB you expect to transfer each month.'
                        )
                        ]"
                      @checkboxTextfieldDataUpdate="solutionTypeDataUpdate"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="col-sm-12 col-md-6">
                    <ATATTextField 
                      id="projectedFileStreamType"
                      ref="projectedFileStreamType"
                      label="Projected file stream/type"
                      :value="domainInfo.projectedFileStream"
                      @update:value="domainInfo.projectedFileStream = $event"
                      :rules="[
                        $validators
                        .required('Enter a projected file stream/type.')
                      ]"
                    />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <AnticipatedDurationandUsage
                      ref="AnticipatedDurationandUsageRef"
                      typeForUsage="cds"
                      typeForDuration="requirement"
                      :anticipatedNeedUsage="
                        domainInfo.anticipatedNeedUsage"
                      @update:anticipatedNeedUsage="
                        domainInfo.anticipatedNeedUsage = $event"
                      :entireDuration="domainInfo.entireDuration"
                      @update:entireDuration="domainInfo.entireDuration = $event"
                      :selectedPeriods="domainInfo.selectedPeriods"
                      @update:selectedPeriods="domainInfo.selectedPeriods = $event"
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
import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";

import { Component, Watch, Vue, toNative, Hook } from "vue-facing-decorator";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import AnticipatedDurationandUsage from "@/components/DOW/AnticipatedDurationandUsage.vue";
import {
  Checkbox,
  CrossDomainSolution,
  RadioButton,
  SaveOnLeaveRefs,
} from "types/Global";
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
class CrossDomain extends Vue {

  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs,
      nextTick: this.$nextTick,
    }).catch(() => false)
  }

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

  private updateCds = false

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
    this.updateCds = true;
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
        // appears as though this is being used as Checkbox[] and string[]
        // causing "this.selectedCDSCheckboxItems" to contain strings
        // when it's typed as only Checkbox[]
        const checkboxItems: any = [];
        const savedSolutionsTypes: {type: string, dataQuantity: number}[] = [];
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
    if(this.updateCds){
      await ClassificationRequirements
        .updateDomainPairsInIGCEEstimateTable(this.domainInfo.solutionType)
    }
    return true;
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}

export default toNative(CrossDomain)
</script>

