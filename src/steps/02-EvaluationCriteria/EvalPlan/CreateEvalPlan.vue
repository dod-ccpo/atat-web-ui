
<template>
  <div class="container-max-width">
    <h1 class="page-header">
      Let’s work on an evaluation plan for your requirement
    </h1>
    <div class="copy-max-width">
      <p class="page-intro">
        In this section, we’ll establish the basis for how your acquisition will 
        be evaluated to assist you and your Contracting Officer (KO) during the 
        source selection process. To begin, select the most applicable evaluation 
        method below. In the following screens, we’ll identify any compliance standards, 
        differentiators, or assessment areas that CSPs must address in their response 
        to the solicitation. You’ll have an opportunity to customize these standards 
        for your specific needs.
      </p>

      <ATATRadioGroup 
        id="EvalPlanOptions"
        legend="Which source selection process is applicable to your requirement?"
        :legend-link="legendLink"
        @openSlideoutPanel="openSlideoutPanel"
        :value.sync="selectedEvalOption"
        :items="evalOptions"
        :rules="[
          $validators.required('Please select an option.'),
        ]"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue"
import { LegendLink, RadioButton, SlideoutPanelContent } from "types/Global"
import SlideoutPanel from "@/store/slideoutPanel";
import CreateEvalPlanSlideOut from "./components/CreateEvalPlanSlideOut.vue";
import { EvaluationPlanDTO, EvalPlanMethod, EvalPlanSourceSelection } from "@/api/models";
import EvaluationCriteria from "@/store/evaluationCriteria";

@Component({
  components: {
    ATATRadioGroup,
    CreateEvalPlanSlideOut,
  }
})

export default class CreateEvalPlan extends Vue {

  public selectedEvalOption: EvalPlanSourceSelection = "";
  public evalOptions: RadioButton[] = [
    {
      label: `I do not require a technical proposal. Award will be made on a 
        Lowest Price, Technically Acceptable (LPTA) basis.`,
      id: "NoTechProposal",
      value: "NoTechProposal"
    },
    {
      label: `I require a technical proposal. Award will be made on either a 
        LPTA or Best Value Trade-Off (BVTO) basis.`,
      id: "TechProposal",
      value: "TechProposal",
    },
    {
      label: `I would like to purchase a set lump sum dollar amount of offerings 
        from any one CSP. Award will be made to the CSP offering either the 
        “best use” or “lowest risk” solution.`,
      id: "SetLumpSum",
      value: "SetLumpSum",
    },
    {
      label: `I would like to purchase an equal set lump sum dollar amount of 
        offerings from each CSP. The Government will issue equal awards to each CSP.`,
      id: "EqualSetLumpSum",
      value: "EqualSetLumpSum",
    }
  ];

  // KEEP FOR TICKET IN UPCOMING SPRINT
  // public selectedMethod: EvalPlanMethod = "";
  // public techProposalOptions: RadioButton[] = [
  //   {
  //     label: "Lowest Price Technically Acceptable (LPTA)",
  //     id: "LPTA",
  //     value: "LPTA",
  //     description: `Award will be made to the lowest priced offeror meeting the
  //       compliance standards.`
  //   },
  //   {
  //     label: "Best Value Trade-Off (BVTO)",
  //     id: "BVTO",
  //     value: "BVTO",
  //     description: "Award will be made to the CSP providing the best value."
  //   },
  // ];

  // KEEP FOR TICKET IN UPCOMING SPRINT
  // public lumpSumOptions: RadioButton[] = [
  //   {
  //     label: "“Best use” solution",
  //     id: "BestUse",
  //     value: "BestUse",
  //     description: "Award will be made to the CSP offering the “best use.”"
  //   },
  //   {
  //     label: "“Lowest risk” solution",
  //     id: "LowestRisk",
  //     value: "LowestRisk",
  //     description: "Award will be made to the CSP providing the lowest risk."
  //   },
  // ];

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

  public get currentData(): EvaluationPlanDTO {
    return {
      // eslint-disable-next-line camelcase
      source_selection: this.selectedEvalOption,
      // KEEP FOR TICKET IN UPCOMING SPRINT
      // method: this.selectedMethod,
    }
  }


  public async mounted(): Promise<void> {
    const slideoutPanelContent: SlideoutPanelContent = {
      component: CreateEvalPlanSlideOut,
      title: "Learn More",
    };
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await EvaluationCriteria.getEvaluationCriteria();
    debugger;
  }

}

</script>
