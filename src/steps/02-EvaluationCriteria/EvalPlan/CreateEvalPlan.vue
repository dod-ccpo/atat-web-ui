
<template>
  <v-form ref="form" lazy-validation>   

    <NoEvalPlan v-if="noEvalPlanNeeded" />

    <div v-else class="container-max-width">

      <h1 class="page-header">
        Let’s work on an evaluation plan for your requirement
      </h1>
      <div class="copy-max-width">
        <p class="page-intro">
          In this section, we'll develop the basis for how your acquisition will be 
          evaluated. To begin, select the applicable evaluation method below. Next, 
          we’ll identify any compliance standards, differentiators,
          or assessment areas that CSPs must address in their response to the 
          solicitation. You’ll have an opportunity to customize these standards for 
          your specific needs.
        </p>

        <ATATRadioGroup 
          id="EvalPlanOptions"
          legend="Which source selection process is applicable to your requirement?"
          :legend-link="legendLink"
          @openSlideoutPanel="openSlideoutPanel"
          :value.sync="sourceSelection"
          :items="evalOptions"
          :rules="[
            $validators.required('Please select an option.'),
          ]"
        />

        <section v-if="showMethods" id="MethodSelectionSection">
          <hr>
          <ATATRadioGroup 
            id="MethodSelection"
            :legend="methodLegend"
            :value.sync="selectedMethod"
            :items="methodOptions"
            :rules="[
              $validators.required(methodRequiredMessage),
            ]"
            :clearErrorMessages.sync="clearMethodErrors"
          />

        </section>

      </div>
    </div>
  </v-form>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue"
import { 
  EvalPlanMethod,
  EvalPlanSourceSelection,
  LegendLink, 
  RadioButton, 
  SlideoutPanelContent
} from "types/Global"
import SlideoutPanel from "@/store/slideoutPanel";
import CreateEvalPlanSlideOut from "./components/CreateEvalPlanSlideOut.vue";
import { EvaluationPlanDTO } from "@/api/models";
import SaveOnLeave from "@/mixins/saveOnLeave";
import LoadOnEnter from "@/mixins/loadOnEnter";
import { hasChanges } from "@/helpers";
import EvaluationPlan from "@/store/acquisitionPackage/evaluationPlan";
import AcquisitionPackage from "@/store/acquisitionPackage";
import NoEvalPlan from "./NoEvalPlan.vue";

@Component({
  components: {
    ATATRadioGroup,
    CreateEvalPlanSlideOut,
    NoEvalPlan,
  }
})

export default class CreateEvalPlan extends Mixins(LoadOnEnter,SaveOnLeave) {
  public isLoading = false;
  public sourceSelection: EvalPlanSourceSelection = "";
  public selectedMethod: EvalPlanMethod = "";

  public noEvalPlanNeeded = AcquisitionPackage.exceptionToFairOpportunity !== "NO_NONE"

  public clearMethodErrors = false;

  @Watch("sourceSelection")
  public sourceSelectionChanged(): void {
    if (!this.isLoading) {
      this.currentData.method = "";
      this.clearMethodErrors = true;
    }
  }

  public evalOptions: RadioButton[] = [
    {
      label: `I do not require a technical proposal. Award will be made on a 
        Lowest Price, Technically Acceptable (LPTA) basis.`,
      id: "NoTechProposal",
      value: "NO_TECH_PROPOSAL"
    },
    {
      label: `I require a technical proposal. Award will be made on either a 
        LPTA or Best Value Trade-Off (BVTO) basis.`,
      id: "TechProposal",
      value: "TECH_PROPOSAL",
    },
    {
      label: `I would like to purchase a set lump sum dollar amount of offerings 
        from any one CSP. Award will be made to the CSP offering either the 
        “best use” or “lowest risk” solution.`,
      id: "SetLumpSum",
      value: "SET_LUMP_SUM",
    },
    {
      label: `I would like to purchase an equal set lump sum dollar amount of 
        offerings from each CSP. The Government will issue equal awards to each CSP.`,
      id: "EqualSetLumpSum",
      value: "EQUAL_SET_LUMP_SUM",
    }
  ];

  public get methodOptions(): RadioButton[] {
    return this.sourceSelection === "TECH_PROPOSAL" 
      ? this.techProposalOptions
      : this.lumpSumOptions;
  }

  public get methodMessagingSubstr(): string {
    return this.sourceSelection === "TECH_PROPOSAL" 
      ? "method of evaluation" : "technique";
  }

  public get methodLegend(): string {
    return `Based on your selection above, which 
      ${this.methodMessagingSubstr} is applicable to your requirement?`;
  }

  public get methodRequiredMessage(): string {
    return "Please select a " + this.methodMessagingSubstr;
  }

  public techProposalOptions: RadioButton[] = [
    {
      label: "Lowest Price Technically Acceptable (LPTA)",
      id: "LPTA",
      value: "LPTA",
      description: `Award will be made to the lowest priced offeror meeting the
        compliance standards.`
    },
    {
      label: "Best Value Trade-Off (BVTO)",
      id: "BVTO",
      value: "BVTO",
      description: "Award will be made to the CSP providing the best value."
    },
  ];

  public lumpSumOptions: RadioButton[] = [
    {
      label: "“Best use” solution",
      id: "BestUse",
      value: "BEST_USE",
      description: "Award will be made to the CSP offering the “best use.”"
    },
    {
      label: "“Lowest risk” solution",
      id: "LowestRisk",
      value: "LOWEST_RISK",
      description: "Award will be made to the CSP providing the lowest risk."
    },
  ];

  public get showMethods(): boolean {
    return this.sourceSelection === "TECH_PROPOSAL" 
      || this.sourceSelection === "SET_LUMP_SUM";
  }

  public legendLink: LegendLink = {
    id: "LearnMore",
    linkText: "Learn more",
    emitText: "openSlideoutPanel"
  }

  public openSlideoutPanel(e: Event): void {
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }

  /* eslint-disable camelcase */
  public get currentData(): EvaluationPlanDTO {
    return {
      source_selection: this.sourceSelection,
      method: this.selectedMethod,
      has_custom_specifications: this.savedData.has_custom_specifications,
      standard_specifications: this.savedData.standard_specifications,
      custom_specifications: this.savedData.custom_specifications,
      standard_differentiators: this.savedData.standard_differentiators,
      custom_differentiators: this.savedData.custom_differentiators,
      sys_id: this.savedData.sys_id
    }
  }

  public savedData: EvaluationPlanDTO = {
    source_selection: "",
    method: "",
    has_custom_specifications: "",
    standard_specifications: "",
    custom_specifications: "",
    standard_differentiators: "",
    custom_differentiators: "",
    sys_id: ""
  }
  /* eslint-enable camelcase */

  public async mounted(): Promise<void> {
    this.isLoading = true;
    const slideoutPanelContent: SlideoutPanelContent = {
      component: CreateEvalPlanSlideOut,
      title: "Learn More",
    };
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
    await this.loadOnEnter();
    this.isLoading = false;
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await EvaluationPlan.getEvaluationPlan();
    if (storeData) {
      this.savedData = storeData;
      this.sourceSelection = storeData.source_selection;
      this.selectedMethod = storeData.method || "";
    }
  }
  
  public get hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }
  public async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged) {
        if (this.sourceSelection !== this.savedData.source_selection
          || this.selectedMethod !== this.savedData.method
        ) {
          // reset specification data if either source or method changed
          /* eslint-disable camelcase */
          this.currentData.has_custom_specifications = undefined;
          this.currentData.standard_specifications = "";
          this.currentData.custom_specifications = "";
          this.currentData.standard_differentiators = "";
          this.currentData.custom_differentiators = "";
          /* eslint-enable camelcase */
        }
        await EvaluationPlan.setEvaluationPlan(this.currentData);
        await EvaluationPlan.saveEvaluationPlan();
      }
    } catch (error) {
      console.log(error);
    }

    return true;

  }

}

</script>
