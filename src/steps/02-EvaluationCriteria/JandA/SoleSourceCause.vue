<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="mb-3">
            Let’s find out more about the cause of the sole source situation
          </h1>
          <div class="copy-max-width">
            <p>
              Answer the series of questions below. Based on your responses, we’ll 
              suggest language to help you complete this portion of your J&A. You’ll 
              be able to edit our suggestions to meet your requirements. If you would 
              rather skip these questions, click the “I want to write my own explanation” 
              button below.
            </p>
            <div class="max-width-740">

              <ATATRadioGroup 
                id="AddlTimeCost"
                name="AddlTimeCost"
                legend="Would a fair opportunity competition require your project to 
                  migrate from one platform to another, resulting in additional time and cost?"
                :value.sync="currentData.cause_migration_addl_time_cost"
                :items="addlTimeCostOptions"
                :rules="[$validators.required('Please select an option.')]"
              />
              <v-expand-transition>
                <div v-if="requiresAddlTimeCost">
                  <ATATTextField
                    id="MigrationEstimatedCost"
                    class="mt-10 mb-10"
                    :value.sync="currentData.cause_migration_estimated_cost"
                    label="Estimated cost to migrate"
                    :isCurrency="true"
                    :width="400"
                    :rules="[$validators.required('Enter the estimated cost to migrate.')]"
                  />
                  <div class="align-left" style="max-width: 400px;">
                    Estimated delay of project for a migration
                    <div class="d-flex justify-space-between">  
                      <ATATTextField
                        id="MigrationEstimatedDelay"
                        class="mt-0"
                        :value.sync="currentData.cause_migration_estimated_delay_amount"
                        label="Estimated delay amount"
                        :labelSrOnly="true"
                        type="number"
                        :width="190"
                        :showErrorMessages="false"
                        :rules="[$validators.required('Enter the estimated cost to migrate.')]"
                        @blur="validateMigrationEstimate"
                      />      
                      
                      <ATATSelect 
                        :items="unitsOfTime"
                        :selectedValue.sync="currentData.cause_migration_estimated_delay_unit"
                        label="Estimated delay unit of time"
                        :labelSrOnly="true"
                        :returnObject="false"
                        :width="190"
                      />
                    </div>

                    <ATATErrorValidation
                      id="MigrationEstimatedDelayValidation"
                      class="atat-text-field-error"
                      v-if="migrationError"
                      :errorMessages="[migrationErrorMessage]"
                    />
                  </div>
                </div>
              </v-expand-transition>

              <hr />

              <ATATRadioGroup 
                id="GovtEngineers"
                name="GovtEngineers"
                :legend="`Are your Government engineers trained and certified in a 
                  specific cloud platform or technology that is unique to ${cspName}?`"
                :value.sync="currentData.cause_govt_engineers_training_certified"
                :items="govtEngineersOptions"
                :rules="[$validators.required('Please select an option.')]"
              />
              <v-expand-transition>
                <div v-if="govtEngineersTrained">

                  <ATATTextField
                    id="PlatformOrTechName"
                    class="mt-10 mb-10"
                    :value.sync="currentData.cause_govt_engineers_platform_name"
                    label="Name of unique cloud platform/technology"
                    :rules="[
                      $validators.required('Enter the name of the cloud platform/technology.')
                    ]"
                  />
                  <ATATTextArea 
                    id="InsufficientTimeReason"
                    label="Why is there insufficient time to retrain and obtain certifications 
                      in another platform?"
                    helpText="Fill in the blank to complete the suggested sentence 
                      below or write your own reason."
                    :value.sync="currentData.cause_govt_engineers_insufficient_time_reason"
                    :maxChars="500"
                    :rows="6"
                    :validateItOnBlur="true"
                    :rules="[
                      $validators.required(insufficientTimeErrorMessage),
                      $validators.notSameAsDefault(
                        insufficientTimeErrorMessage,
                        defaultInsufficientTimeReason
                      )
                    ]"
                  />

                </div>
              </v-expand-transition>

              <hr />

              <ATATRadioGroup 
                id="ProductFeature"
                name="ProductFeature"
                :legend="`Is there a specific product or feature that is peculiar to ${cspName}?`"
                :value.sync="currentData.cause_product_feature_peculiar_to_csp"
                :items="productFeatureOptions"
                :rules="[$validators.required('Please select an option.')]"
              />
              <v-expand-transition>
                <div v-if="hasPeculiarProduct">
                  peculiar product/feature fields
                </div>
              </v-expand-transition>

            </div>
          </div>

        </v-col>
      </v-row>
    </v-container>    
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Mixins, Watch } from "vue-property-decorator";

import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import { RadioButton, SelectData } from "types/Global";
import { FairOpportunityDTO } from "@/api/models";
import { getYesNoRadioOptions, hasChanges } from "@/helpers";
import AcquisitionPackage from "@/store/acquisitionPackage";
import _ from "lodash";
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATErrorValidation,
    ATATRadioGroup,
    ATATSelect,
    ATATTextArea,
    ATATTextField,
  }
})

export default class SoleSourceCause extends Mixins(SaveOnLeave) {
  public cspName = "";
  public addlTimeCostOptions: RadioButton[] = getYesNoRadioOptions("AddlTimeCost");
  public requiresAddlTimeCost = false;
  public migrationError = false;
  public migrationErrorMessage = "";

  public govtEngineersOptions: RadioButton[] = getYesNoRadioOptions("GovtEngineers");
  public govtEngineersTrained = false;
  public defaultInsufficientTimeReason = "Due to ..., there is insufficient time to " +
    "retrain and obtain certification in another platform/technology.";
  public insufficientTimeErrorMessage = "Explain why there is insufficient time."

  public productFeatureOptions: RadioButton[] = getYesNoRadioOptions("ProdFeat");
  public hasPeculiarProduct = false;

  public unitsOfTime: SelectData[] = [
    { text: "Day(s)", value: "DAYS" },
    { text: "Week(s)", value: "WEEKS" },
    { text: "Month(s)", value: "MONTHS" },
    { text: "Year(s)", value: "YEARS" },
  ];

  @Watch("currentData", {deep: true})
  public currentDataChanged(
    nVal: FairOpportunityDTO, oVal: FairOpportunityDTO
  ): void {
    this.requiresAddlTimeCost 
      = nVal.cause_migration_addl_time_cost === "YES" ? true : false;
    this.govtEngineersTrained 
      = nVal.cause_govt_engineers_training_certified === "YES" ? true : false;
    this.hasPeculiarProduct 
      = nVal.cause_product_feature_peculiar_to_csp === "YES" ? true : false;
    if (nVal.cause_migration_estimated_delay_amount !== oVal.cause_migration_estimated_delay_amount
      || nVal.cause_migration_estimated_cost !== oVal.cause_migration_estimated_cost) {
      this.validateMigrationEstimate();
    }
  }

  public validateMigrationEstimate(): void {
    this.migrationError = false;
    this.migrationErrorMessage = "";
    const cost = this.currentData.cause_migration_estimated_cost;
    const delay = this.currentData.cause_migration_estimated_delay_amount as unknown as string;
    if ((!cost || cost === "0.00") && (!delay || parseInt(delay) === 0)) {
      this.migrationError = true;
      this.migrationErrorMessage = `Either your estimated cost or estimated delay 
        must be greater than 0.`;
    } else if (!delay) {
      this.migrationError = true;
      this.migrationErrorMessage = "Enter the estimated delay for a migration.";
    }
  }

  // public validateInsufficientTimeReason(): void {
  //   this.insufficientTimeReasonError = false;
  //   if (this.currentData.cause_govt_engineers_insufficient_time_reason
  //     === this.defaultInsufficientTimeReason) {
  //     this.insufficientTimeReasonError = true;
  //   }
  // }


  public currentData: FairOpportunityDTO = {}
  private get savedData(): FairOpportunityDTO {
    return AcquisitionPackage.fairOpportunity || AcquisitionPackage.getInitialFairOpportunity();
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }



  public async loadOnEnter(): Promise<void> {
    debugger;
    const storeData = _.cloneDeep(AcquisitionPackage.fairOpportunity);
    if (storeData) {
      this.currentData = storeData;

      // eslint-disable-next-line camelcase
      this.currentData.cause_migration_estimated_delay_unit 
        = this.currentData.cause_migration_estimated_delay_unit || "MONTHS"; 

      // eslint-disable-next-line camelcase
      this.currentData.cause_govt_engineers_insufficient_time_reason
        = this.currentData.cause_govt_engineers_insufficient_time_reason
        || this.defaultInsufficientTimeReason;

      const cspNames = {
        AWS: "Amazon",
        GCP: "Google",
        AZURE: "Microsoft",
        ORACLE: "Oracle",
      }      
      this.cspName = storeData.proposed_csp ? cspNames[storeData.proposed_csp] : "your CSP";
    }
  }

  protected async saveOnLeave(): Promise<boolean> {
    debugger;
    // EJY - KEEP AN EYE ON VARIOUS CUSTOM VALIATIONS
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.setFairOpportunity(this.currentData)
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
</script>

