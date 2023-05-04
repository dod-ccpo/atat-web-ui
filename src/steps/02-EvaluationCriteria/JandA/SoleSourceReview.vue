<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="mb-3">
            {{ pagewHeaderIntro }} the cause of your sole source situation
          </h1>
          <div class="copy-max-width">
            <p class="mb-4" v-if="!writeOwnExplanation">
              Based on what you’ve told us, we’ve suggested language to explain the 
              factors that led to your decision to solicit only one source for this 
              project. You can edit any details to meet your requirements, but be sure
              to include all relevant information from the following instructions.
            </p>
            <p class="mb-4" v-else-if="allSectionsNO">
              Your project has an uncommon cause for an exception to fair opportunity, 
              so unfortunately, we were not able to suggest language to help you 
              complete this portion of the J&A. In the field below, please explain 
              the factors that led to your decision to solicit only one source for 
              this project. Be sure to include any relevant details from the following 
              instructions.
            </p>
            <p class="mb-4" v-else>
              In the field below, please explain the factors that led to your decision
              to solicit only one source for this project. Be sure to include any 
              relevant details from the following instructions.
            </p>
            <ATATExpandableLink 
            aria-id="Instructions"
            >
              <template v-slot:header>
                Instructions for this portion of the J&A
              </template>
              <template v-slot:content>
                <ul class="_atat-ul">
                  <li>
                    If full and open competition would be feasible had more time been 
                    available, discuss other factors that impacted the decision to 
                    solicit only one source (e.g., time required to conduct a competitive 
                    procurement; consideration of phase-in/phase-out requirements; 
                    complexity of requirement; etc.). 
                  </li>
                  <li>
                    If the required delivery date could have been satisfied using full 
                    and open competition on the date the requirement first became known, 
                    provide an explanation for the delay in submitting the requirement.
                  </li>
                  <li>
                    If normal contracting methods could not have satisfied the required 
                    delivery date, describe the circumstances that caused this emergency 
                    and how they will be prevented in the future. 
                  </li>
                </ul>
              </template>
            </ATATExpandableLink>

            <ATATTextArea 
              id="SoleSourceSituation"
              class="mt-6 textarea-max-width"
              label="Cause of your sole source situation"
              :labelSrOnly="true"
              :value.sync="soleSourceCause"
              :rows="getRowCount"
              :maxChars="2500"
              :validateItOnBlur="true"
              :rules="[
                this.$validators.required(`Enter an explanation for the cause of 
                  your sole source situation.`),
                this.$validators.maxLength(2500)
              ]"
            />

            <v-btn
              id="RestoreSuggestionButton"
              v-if="!writeOwnExplanation"
              class="secondary font-size-14 px-4 mb-1 mt-1"
              :disabled="isSoleSourceCauseIsDefault"
              @click="confirmRestoreDefaultText"
            >
              <ATATSVGIcon
                id="RestoreSuggestionButtonIcon"
                width="19"
                height="15"
                name="restore"
                class="mr-1"
                :color="btnRestoreIconColor"
              />
              Restore to suggestion
            </v-btn>

          </div>
        </v-col>
      </v-row>
    </v-container>    
    <ConfirmRestoreDefaultTextModal
      @okRestore="restoreSuggestion"
      :showRestoreModal.sync="showRestoreModal"
      :isBasedOnResponses="true"
    />
  </v-form>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";

import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATExpandableLink from "@/components/ATATExpandableLink.vue"
import ATATTextArea from "@/components/ATATTextArea.vue";
import ConfirmRestoreDefaultTextModal from "../components/ConfirmRestoreDefaultTextModal.vue";


import AcquisitionPackage from "@/store/acquisitionPackage";
import _ from "lodash";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { currencyStringToNumber, hasChanges, toCurrencyString } from "@/helpers";
import { FairOpportunityDTO } from "@/api/models";

@Component({
  components: {
    ATATSVGIcon,
    ATATExpandableLink,
    ATATTextArea,
    ConfirmRestoreDefaultTextModal,
  }
})

export default class SoleSourceReview extends Mixins(SaveOnLeave) {
  public projectTitle = AcquisitionPackage.projectTitle;
  public soleSourceCause = "";
  public defaultSuggestion = "";
  public showRestoreModal = false;

  public writeOwnExplanation = false;
  public allSectionsNO = false;
  public get pagewHeaderIntro(): string {
    return this.writeOwnExplanation ? "Tell us about" : "Let’s review";
  }

  public get cspName(): string {
    return this.csps[this.currentData.proposed_csp as string]
  }

  public csps: Record<string, string> = {
    AWS: "AWS",
    GCP: "Google Cloud",
    AZURE: "Microsoft Azure",
    ORACLE: "Oracle Cloud",
  }

  public get getMigrationP(): string {
    const estCost = parseFloat(this.currentData.cause_migration_estimated_cost as string);
    const hasEstCost = !isNaN(estCost) && estCost > 0;
    const hasEstDelay = this.currentData.cause_migration_estimated_delay_amount 
      && this.currentData.cause_migration_estimated_delay_amount !== "0";

    let migrationP =  "The only source capable of performing the " + this.projectTitle + 
    " at the level of quality required is the incumbent contractor, " + this.cspName +
    ". The refactoring of the current environment from the "  + this.cspName + 
    " environment to another CSP would result in additional ";
    if (hasEstCost) migrationP += "cost";
    if (hasEstCost && hasEstDelay) migrationP += " and ";
    if (hasEstDelay) migrationP +="time"
    migrationP += ". Migration from one platform to another platform would ";
    if (hasEstCost) {
      migrationP += "cost " + this.getCostAmount
    }
    if (hasEstDelay) {
      if (estCost) {
        migrationP += " and ";
      }
      const estDelayAmt
        = parseInt(this.currentData.cause_migration_estimated_delay_amount as string);
      let estDelayUnit 
        = (this.currentData.cause_migration_estimated_delay_unit as string).toLowerCase();
      estDelayUnit = estDelayAmt > 1 ? estDelayUnit : estDelayUnit.slice(0,-1);

      migrationP += "delay the project " + estDelayAmt + " " + estDelayUnit;
    }
    migrationP += ". In addition, there would be a duplication of costs of having " +
      "to keep the solution running on one platform while refactoring it on another platform."

    return migrationP;
  }

  public get getEngineersP(): string {
    return "Further, the only source capable of performing the " + this.projectTitle +
      " at the level and quality required is " + this.cspName + " based on Government engineers " +
      "being trained and certified in " + this.currentData.cause_govt_engineers_platform_name + 
      ". " + this.currentData.cause_govt_engineers_insufficient_time_reason;   
  }

  public get getProductFeatureP(): string {
    return "The only source capable of performing the "  + this.projectTitle +
      " at the level and quality required is " + this.cspName + " based on "
      + this.currentData.cause_product_feature_name + " that is peculiar to " + this.cspName +
      ". " + this.currentData.cause_product_feature_why_essential + " " + 
      this.currentData.cause_product_feature_why_others_inadequate;
  }

  public generateSuggestion(): void {
    const needsMigrationP = this.savedData?.cause_migration_addl_time_cost === "YES";
    const needsGovtEngineersP = this.savedData?.cause_govt_engineers_training_certified === "YES";
    const needsProductFeatureP = this.savedData?.cause_product_feature_peculiar_to_csp === "YES";

    let suggestedText = "";
    if (needsMigrationP) {
      suggestedText += this.getMigrationP;
      if (needsGovtEngineersP || needsProductFeatureP) suggestedText += "\n\n";
    }
    if (needsGovtEngineersP) {
      suggestedText += this.getEngineersP;
      if (needsProductFeatureP) suggestedText += "\n\n";
    }
    if (needsProductFeatureP) suggestedText += this.getProductFeatureP;
    
    this.soleSourceCause = this.soleSourceCause || suggestedText;
    this.defaultSuggestion = suggestedText;
  }

  public get getRowCount(): number {
    return this.writeOwnExplanation ? 12 : 19;
  }

  public isSoleSourceCauseIsDefault = false;
  @Watch("soleSourceCause")
  public soleSourceCauseChanged(): void {
    this.isSoleSourceCauseIsDefault = this.soleSourceCause === this.defaultSuggestion;
  }

  public restoreSuggestion(): void {
    this.soleSourceCause = this.defaultSuggestion;
    this.showRestoreModal = false;
  }

  public confirmRestoreDefaultText(): void {
    this.showRestoreModal = true;
  }

  get btnRestoreIconColor(): string {
    return this.isSoleSourceCauseIsDefault ? "disabled" : "primary";
  }

  public get currentData(): FairOpportunityDTO {
    const fairOppSaved: FairOpportunityDTO 
      = _.cloneDeep(AcquisitionPackage.fairOpportunity) 
      || _.cloneDeep(AcquisitionPackage.getInitialFairOpportunity());
    const formData: FairOpportunityDTO = {
      // eslint-disable-next-line camelcase
      cause_of_sole_source_generated: this.soleSourceCause as string,
    }
    return Object.assign(fairOppSaved, formData);
  }

  private get savedData(): FairOpportunityDTO | null {
    return AcquisitionPackage.getFairOpportunity;
  }

  public get getCostAmount(): string {
    if (this.currentData.cause_migration_estimated_cost) {
      const amt = currencyStringToNumber(this.currentData.cause_migration_estimated_cost)
      if (amt) return "$" + toCurrencyString(amt, true);
    }
    return "";
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = _.cloneDeep(AcquisitionPackage.fairOpportunity);
    if (storeData) {
      this.soleSourceCause = storeData.cause_of_sole_source_generated as string;

      this.allSectionsNO = storeData.cause_migration_addl_time_cost === "NO"
        && storeData.cause_govt_engineers_training_certified === "NO"
        && storeData.cause_product_feature_peculiar_to_csp === "NO";

      this.writeOwnExplanation = storeData.cause_write_own_explanation === "YES";
      if (!this.writeOwnExplanation) {
        this.generateSuggestion();
      }
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
  
  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.setFairOpportunity(this.currentData)
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }

}
</script>
