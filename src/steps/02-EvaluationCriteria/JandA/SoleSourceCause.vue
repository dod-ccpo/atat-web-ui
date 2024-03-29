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
              be able to edit our suggestions to meet your requirements. 
              <span v-if="!hadExplanationOnLoad">
                If you would rather skip these questions, click the “I want to write 
                my own explanation” button below.
              </span>
            </p>
            
            <v-expand-transition>
              <AlertForForms  v-if="showAlert" :alertType="alertType" />
            </v-expand-transition>

            <div class="max-width-740">

              <ATATRadioGroup 
                id="AddlTimeCost"
                ref="AddlTimeCostRef"
                name="AddlTimeCost"
                legend="Would a fair opportunity competition require your project to 
                  migrate from one platform to another, resulting in additional time and cost?"
                :value="migrAddlTimeCost"
                @update:value="migrAddlTimeCost = $event"
                :items="addlTimeCostOptions"
                :rules="[$validators.required('Please select an option.')]"
              />
              <v-expand-transition>
                <div v-if="requiresAddlTimeCost">
                  <ATATTextField
                    id="MigrationEstimatedCost"
                    ref="MigrationEstimatedCostRef"
                    class="mt-10 mb-10"
                    :value="migrEstCost"
                    @update:value="migrEstCost = $event"
                    label="Estimated cost to migrate"
                    :isCurrency="true"
                    :width="400"
                    :allowZeroDefault="false"
                    :rules="[$validators.required('Enter the estimated cost to migrate.')]"
                    @blur="validateMigrationEstimate"
                  />
                  <div class="align-left" style="max-width: 400px;">
                    Estimated delay of project for a migration
                    <div class="d-flex justify-space-between">  
                      <ATATTextField
                        id="MigrationEstimatedDelay"
                        ref="MigrationEstimatedDelayRef"
                        class="mt-0"
                        :value="migrEstDelayAmt"
                        @update:value="migrEstDelayAmt = $event"
                        label="Estimated delay amount"
                        :labelSrOnly="true"
                        type="number"
                        :width="190"
                        :showErrorMessages="false"
                        :rules="[$validators.required('Enter the estimated cost to migrate.')]"
                        @blur="validateMigrationEstimate"
                      />      
                      
                      <ATATSelect 
                        id="MigrationSelect"
                        ref="MigrationSelectRef"
                        :items="unitsOfTime"
                        :selectedValue="migrEstDelayUnit"
                        @update:selectedValue="migrEstDelayUnit = $event"
                        label="Estimated delay unit of time"
                        :labelSrOnly="true"
                        :returnObject="false"
                        :width="190"
                      />
                    </div>

                    <ATATErrorValidation
                      id="MigrationEstimatedDelayValidation"
                      ref="MigrationEstimatedDelayValidationRef"
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
                ref="GovtEngineersRef"
                name="GovtEngineers"
                :legend="`Are your Government engineers trained and certified in a 
                  specific cloud platform or technology that is unique to ${cspName}?`"
                :value="geCertified"
                @update:value="geCertified = $event"
                :items="govtEngineersOptions"
                :rules="[$validators.required('Please select an option.')]"
              />
              <v-expand-transition>
                <div v-if="govtEngineersTrained">

                  <ATATTextField
                    id="PlatformOrTechName"
                    ref="PlatformOrTechNameRef"
                    class="mt-10 mb-10"
                    :value="gePlatformName"
                    @update:value="gePlatformName = $event"
                    label="Name of unique cloud platform/technology"
                    :rules="[
                      $validators.required('Enter the name of the cloud platform/technology.')
                    ]"
                  />
                  <ATATTextArea 
                    id="InsufficientTimeReason"
                    ref="InsufficientTimeReasonRef"
                    label="Why is there insufficient time to retrain and obtain certifications 
                      in another platform?"
                    helpText="Fill in the blank to complete the suggested sentence 
                      below or write your own reason."
                    :value="geInsufficientTimeReason"
                    @update:value="geInsufficientTimeReason = $event"
                    :maxChars="500"
                    :rows="6"
                    :validateItOnBlur="true"
                    :rules="[
                      $validators.required(insufficientTimeErrorMessage),
                      $validators.notSameAsDefault(
                        insufficientTimeErrorMessage,
                        defaultInsufficientTimeReason
                      ),
                      $validators.maxLength(500)
                    ]"
                  />

                </div>
              </v-expand-transition>

              <hr />

              <ATATRadioGroup 
                id="ProductFeature"
                ref="ProductFeatureRef"
                name="ProductFeature"
                :legend="`Is there a specific product or feature that is peculiar to ${cspName}?`"
                :value="pfPeculiarToCSP"
                @update:value="pfPeculiarToCSP = $event"
                :items="isPeculiarOptions"
                :rules="[$validators.required('Please select an option.')]"
              />
              <v-expand-transition>
                <div class="mt-10" v-if="hasPeculiarProduct">
                  <ATATRadioGroup 
                    id="IsProductOrFeature"
                    ref="IsProductOrFeatureRef"
                    name="IsProductOrFeature"
                    legend="Is it a product or feature?"
                    :value="pfType"
                    @update:value="pfType = $event"
                    :items="productOrFeatureOptions"
                    :rules="[$validators.required('Please select an option.')]"
                  />
                  <v-expand-transition>
                    <div class="mt-10" v-if="productOrFeatureSelected">
                      <ATATTextField
                        id="UniqueProduct"
                        ref="UniqueProductRef"
                        class="mt-10 mb-10"
                        :value="pfName"
                        @update:value="pfName = $event"
                        :label="`Name of the unique ${productOrFeatureStr}`"
                        :rules="[
                          $validators.required(`Enter the name of your ${productOrFeatureStr}.`)
                        ]"
                      />

                      <ATATTextArea 
                        id="WhyEssential"
                        ref="WhyEssentialRef"
                        :label="`Why is this ${productOrFeatureStr} essential to 
                          the Government’s requirements?`"
                        helpText="Fill in the blank to complete the suggested sentence 
                          below or write your own reason."
                        :value="pfWhyEssential"
                        @update:value="pfWhyEssential = $event"
                        :maxChars="500"
                        :rows="6"
                        :validateItOnBlur="true"
                        :turnRulesOff="whyEssentialRulesOff"
                        @update:turnRulesOff="whyEssentialRulesOff = $event"
                        :rules="[
                          $validators.required(whyEssentialErrorMessage),
                          $validators.notSameAsDefault(
                            whyEssentialErrorMessage,
                            defaultWhyEssential
                          ),
                          $validators.maxLength(500)
                        ]"
                      />

                      <ATATTextArea 
                        id="WhyInadequate"
                        ref="WhyInadequateRef"
                        class="mt-10"
                        :label="`Why do other similar ${productOrFeatureStr}s not 
                          meet the Government’s requirements?`"
                        helpText="Fill in the blank to complete the suggested sentence 
                          below or write your own reason."
                        :value="pfWhyOthersInadequate"
                        @update:value="pfWhyOthersInadequate = $event"
                        :maxChars="500"
                        :rows="6"
                        :validateItOnBlur="true"
                        :turnRulesOff="whyInadequateRulesOff"
                        @update:turnRulesOff="whyInadequateRulesOff = $event"
                        :rules="[
                          $validators.required(whyOthersInadequateErrorMessage),
                          $validators.notSameAsDefault(
                            whyOthersInadequateErrorMessage,
                            defaultWhyOthersInadequate
                          ),
                          $validators.maxLength(500)
                        ]"
                      />

                    </div>

                  </v-expand-transition>
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
import { Component, Watch, Vue, toNative, Hook } from "vue-facing-decorator";

import AlertForForms from "../components/AlertForForms.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATAlert from "@/components/ATATAlert.vue";

import { ProductOrType, RadioButton, SelectData, UnitOfTime, YesNo } from "types/Global";
import { FairOppDocGenType, FairOpportunityDTO } from "@/api/models";
import { getCSPCompanyName, getYesNoRadioOptions, hasChanges } from "@/helpers";
import AcquisitionPackage from "@/store/acquisitionPackage";
import _ from "lodash";
import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";
import { SaveOnLeaveRefs } from 'types/Global'

@Component({
  components: {
    AlertForForms,
    ATATErrorValidation,
    ATATRadioGroup,
    ATATSelect,
    ATATTextArea,
    ATATTextField,
    ATATAlert
  }
})

class SoleSourceCause extends Vue {

  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs, 
      nextTick: this.$nextTick,
    }).catch()
  }

  public cspName = "";
  public writeOwnExplanation: YesNo = "";
  public isLoading = false;

  public hasSuggestedTextBeenEdited = false;
  public isCustomExplanation = false;
  public hasExplanation = false;
  public explanationForDocgen: FairOppDocGenType = "";
  public hadExplanationOnLoad = false;

  public explanation = AcquisitionPackage.fairOppExplanations.soleSource;

  // MIGRATION SECTION
  public migrAddlTimeCost: YesNo = "";
  public migrEstCost = "";
  public migrEstDelayAmt = "";
  public migrEstDelayUnit: UnitOfTime = "";

  public addlTimeCostOptions: RadioButton[] = getYesNoRadioOptions("AddlTimeCost");
  public requiresAddlTimeCost = false;
  public migrationError = false;
  public migrationErrorMessage = "";
  
  // GOVT ENGINEERS SECTION
  public geCertified: YesNo = "";
  public gePlatformName = "";
  public geInsufficientTimeReason = "";

  public govtEngineersOptions: RadioButton[] = getYesNoRadioOptions("GovtEngineers");
  public govtEngineersTrained = false;
  public defaultInsufficientTimeReason = "Due to ..., there is insufficient time to " +
    "retrain and obtain certification in another platform/technology.";
  public insufficientTimeErrorMessage = "Explain why there is insufficient time."

  // PRODUCT FEATURE SECTION
  public pfPeculiarToCSP: YesNo = "";
  public pfType: ProductOrType = "";
  public pfName = "";
  public pfWhyEssential = "";
  public pfWhyOthersInadequate = "";

  public isPeculiarOptions: RadioButton[] = getYesNoRadioOptions("ProdFeat");
  public hasPeculiarProduct = false;
  public productOrFeatureOptions: RadioButton[] = [
    { id: "Product", label: "Product", value: "PRODUCT" },
    { id: "Feature", label: "Feature", value: "FEATURE" },
  ];
  public productOrFeatureSelected = false;
  public get whyEssentialErrorMessage(): string {
    return `Describe why the ${this.productOrFeatureStr} is essential.`;
  }
  public defaultWhyEssential = "";
  public defaultWhyOthersInadequate = ""

  public get whyOthersInadequateErrorMessage(): string {
    return `Describe why other ${this.productOrFeatureStr}s do not meet your requirements`;
  }
  public get productOrFeatureStr(): string {
    return this.currentData.cause_product_feature_type
      ? this.currentData.cause_product_feature_type.toLowerCase()
      : "";
  }

  public whyEssentialRulesOff = false;
  public whyInadequateRulesOff = false;
  
  public unitsOfTime: SelectData[] = [
    { text: "Day(s)", value: "DAYS" },
    { text: "Week(s)", value: "WEEKS" },
    { text: "Month(s)", value: "MONTHS" },
    { text: "Year(s)", value: "YEARS" },
  ];

  @Watch("migrAddlTimeCost")
  public migrAddlTimeCostChanged(newVal: YesNo): void {
    this.requiresAddlTimeCost = newVal === "YES" ? true : false;    
  }
  @Watch("geCertified")
  public geCertifiedChanged(newVal: YesNo): void {
    this.govtEngineersTrained = newVal === "YES" ? true : false;
  }
  @Watch("pfPeculiarToCSP")
  public pfPeculiarToCSPChanged(newVal: YesNo): void {
    this.hasPeculiarProduct = newVal === "YES" ? true : false;    
  }
  @Watch("pfType")
  public pfTypeChanged(newVal: string, oldVal: string): void {
    this.whyEssentialRulesOff = true;
    this.whyInadequateRulesOff = true;
    this.productOrFeatureSelected = true;   
    oldVal = oldVal.toLowerCase();
    newVal = newVal.toLowerCase();
    if (!this.isLoading) {
      // update DEFAULT text for why product/feature is essential
      // get first two words from old default why essential
      const prevEssentialStart = oldVal 
        ? this.defaultWhyEssential.split(" ").slice(0,2).join(" ").toLowerCase() : ""; 
      this.defaultWhyEssential = "This " + this.productOrFeatureStr + " is essential " +
        "to the Government’s requirements due to...";      
      // if no oldVal (product/feature radios hadn't been selected) OR
      // if oldEntryLength (length of what's in the textarea) is same as new default length,
      // no changes were made, just swap the new default text into the value
      if (!oldVal || this.pfWhyEssential.length === this.defaultWhyEssential.length) {
        this.pfWhyEssential = this.defaultWhyEssential;
      } else if (prevEssentialStart === "this " + oldVal) {
        // just change the 2nd word from oldVal to newVal 
        // (e.g., from "product" to "feature" or vice-versa)
        const substrEssential = this.pfWhyEssential.slice(prevEssentialStart.length);
        this.pfWhyEssential = "This " + newVal + substrEssential;
      }

      // update DEFAULT why other similar products/features are inadequate
      const prevInadequateStart = oldVal 
        ? this.defaultWhyOthersInadequate.split(" ").slice(0,3).join(" ").toLowerCase() : ""; 
      this.defaultWhyOthersInadequate = "Other similar " + this.productOrFeatureStr + "s " +
        "do not meet, nor can be modified to meet, the Government’s requirements due to...";
      if (!oldVal || this.pfWhyOthersInadequate.length === this.defaultWhyOthersInadequate.length) {
        this.pfWhyOthersInadequate = this.defaultWhyOthersInadequate;
      } else if (prevInadequateStart === "other similar " + oldVal + "s") {
        const substrInadequate = this.pfWhyOthersInadequate.slice(prevInadequateStart.length);
        this.pfWhyOthersInadequate = "Other similar " + newVal + "s" + substrInadequate;
      }
    }
  }

  public get mCost(): string {
    return this.currentData.cause_migration_estimated_cost as string;
  }
  public get mDelay(): string {
    return this.currentData.cause_migration_estimated_delay_amount as string;
  }

  public get showAlert(): boolean{
    return this.hasExplanation && 
      (this.isCustomExplanation || this.hasSuggestedTextBeenEdited);
  }
  public get alertType(): string {
    if (this.hasExplanation) {
      if (this.isCustomExplanation) return "custom";
      if (this.hasSuggestedTextBeenEdited) return "suggestion";
    }
    return "";
  }

  public validateMigrationEstimate(): void {
    this.migrationError = false;
    this.migrationErrorMessage = "";
    const skipValidation = AcquisitionPackage.skipValidation;
    if ((!this.mCost || this.mCost === "0.00")
    && (!this.mDelay || parseInt(this.mDelay) === 0)
    && !skipValidation) {
      this.migrationError = true;
      this.migrationErrorMessage = `Either your estimated cost or estimated delay 
        must be greater than 0.`;
    } else if (!this.mDelay && !skipValidation) {
      this.migrationError = true;
      this.migrationErrorMessage = "Enter the estimated delay for a migration.";
    }
  }

  public get currentData(): FairOpportunityDTO {
    const fairOppSaved: FairOpportunityDTO 
      = _.cloneDeep(AcquisitionPackage.fairOpportunity) 
      || _.cloneDeep(AcquisitionPackage.getInitialFairOpportunity());
    const formData: FairOpportunityDTO = {
      /* eslint-disable camelcase */
      cause_write_own_explanation: this.writeOwnExplanation,

      cause_migration_addl_time_cost: this.migrAddlTimeCost,
      cause_migration_estimated_cost: this.migrEstCost,
      cause_migration_estimated_delay_amount: this.migrEstDelayAmt,
      cause_migration_estimated_delay_unit: this.migrEstDelayUnit,

      cause_govt_engineers_training_certified: this.geCertified,
      cause_govt_engineers_platform_name: this.gePlatformName,
      cause_govt_engineers_insufficient_time_reason: this.geInsufficientTimeReason,

      cause_product_feature_peculiar_to_csp: this.pfPeculiarToCSP,
      cause_product_feature_type: this.pfType,
      cause_product_feature_name: this.pfName,
      cause_product_feature_why_essential: this.pfWhyEssential,
      cause_product_feature_why_others_inadequate: this.pfWhyOthersInadequate,

      cause_of_sole_source_for_docgen: this.explanationForDocgen,
      /* eslint-enable camelcase */
    }
    return Object.assign(fairOppSaved, formData);
  }

  private get savedData(): FairOpportunityDTO | null {
    return AcquisitionPackage.getFairOpportunity;
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async loadOnEnter(): Promise<void> {
    // eslint-disable-next-line camelcase
    await AcquisitionPackage.setFairOpportunity({cause_write_own_explanation: "NO"})

    const storeData = _.cloneDeep(AcquisitionPackage.fairOpportunity);
    if (storeData) {
      this.writeOwnExplanation = "NO";
      this.explanationForDocgen = storeData.cause_of_sole_source_for_docgen;
      this.migrAddlTimeCost = storeData.cause_migration_addl_time_cost as YesNo;
      this.migrEstCost = storeData.cause_migration_estimated_cost as string;
      this.migrEstDelayAmt = storeData.cause_migration_estimated_delay_amount as string;
      this.migrEstDelayUnit = storeData.cause_migration_estimated_delay_unit || "MONTHS";

      this.geCertified = storeData.cause_govt_engineers_training_certified as YesNo;
      this.gePlatformName = storeData.cause_govt_engineers_platform_name as string;
      this.geInsufficientTimeReason = storeData.cause_govt_engineers_insufficient_time_reason 
        || this.defaultInsufficientTimeReason;
      
      this.pfPeculiarToCSP = storeData.cause_product_feature_peculiar_to_csp as YesNo;
      this.pfType = storeData.cause_product_feature_type;
      this.pfName = storeData.cause_product_feature_name as string;
      this.pfWhyEssential = storeData.cause_product_feature_why_essential as string;
      this.pfWhyOthersInadequate = storeData.cause_product_feature_why_others_inadequate as string;
   
      this.cspName = storeData.proposed_csp 
        ? getCSPCompanyName(storeData.proposed_csp) 
        : "your CSP";

      this.hasExplanation = storeData.cause_of_sole_source_generated !== ""
        || storeData.cause_of_sole_source_custom !== "";
    }
    
    this.hadExplanationOnLoad = this.explanation.hadExplanationOnLoad as boolean;
    this.hasSuggestedTextBeenEdited = this.explanation.defaultSuggestionEdited as boolean;
    this.isCustomExplanation = this.explanation.useCustomText as boolean;

  }

  protected async saveOnLeave(): Promise<boolean> {
    this.whyEssentialRulesOff = false;
    this.whyInadequateRulesOff = false;
    if (this.migrAddlTimeCost === "YES") {
      this.validateMigrationEstimate();
      if (this.migrationError === true) {
        return false;
      }
    }

    this.geInsufficientTimeReason = this.geInsufficientTimeReason.trim();
    this.pfWhyEssential = this.pfWhyEssential.trim();
    this.pfWhyOthersInadequate = this.pfWhyOthersInadequate.trim();

    // ensure data cleared if any section main question is "NO"
    let sectionsWithNoSelectedCount = 0;
    if (this.migrAddlTimeCost !== "YES") {
      this.migrEstCost = "";
      this.migrEstDelayAmt = "";
      this.migrEstDelayUnit = "";
      sectionsWithNoSelectedCount++;
    }
    if (this.geCertified !== "YES") {
      this.gePlatformName = "";
      this.geInsufficientTimeReason = "";
      sectionsWithNoSelectedCount++;
    }
    if (this.pfPeculiarToCSP !== "YES") {
      this.pfType = "";
      this.pfName = "";
      this.pfWhyEssential = "";
      this.pfWhyOthersInadequate = "";
      sectionsWithNoSelectedCount++;
    }

    try {
      if (this.hasChanged()) {
        this.explanation.formEdited = true;
        /* eslint-disable camelcase */
        this.writeOwnExplanation 
          = AcquisitionPackage.fairOpportunity?.cause_write_own_explanation as YesNo;

        if (this.explanationForDocgen === "CUSTOM") {
          await AcquisitionPackage.setReplaceCustomWithGenerated(
            {section: "soleSource", val: true }
          );
        }

        if (this.writeOwnExplanation === "NO") {
          // if it's already "YES" (set from action handler when "I want to write 
          //  my own explanation" button, don't change it, but if it's NO as set on page load, 
          // check if user answered "NO" to all 3 sections 
          this.writeOwnExplanation = sectionsWithNoSelectedCount === 3 ? "YES" : "NO";
          this.explanationForDocgen = this.writeOwnExplanation === "YES" ? "CUSTOM" : "GENERATED";
        } else {
          this.explanationForDocgen = "CUSTOM";
        }
        this.explanation.useCustomText = this.explanationForDocgen === "CUSTOM";

        await AcquisitionPackage.setFairOpportunity(this.currentData)
      }
    } catch (error) {
      console.log(error);
    }

    return true;

  }
  public async mounted(): Promise<void> {
    this.isLoading = true;
    await this.loadOnEnter();
    this.isLoading = false;
  }

}

export default toNative(SoleSourceCause )
</script>

