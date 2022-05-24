
<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Let’s work on your performance requirements
          </h1>
          <div class="copy-max-width">
            <p class="mb-10">
              Through JWCC, you have the ability to procure many offerings for 
              Anything as a Service (XaaS) and Cloud Support Packages. Specify 
              any categories that may apply to your acquisition below, and we’ll 
              walk through each selection to get more details next. 
              <a 
                role="button" 
                @click="openSlideoutPanel"
                @keydown.enter="openSlideoutPanel"
                @keydown.space="openSlideoutPanel"
                tabindex="0"
              >
                Learn more about categories.
              </a>
            </p>

            <p id="XaaSLabel" class="_checkbox-group-label">
              What type of XaaS resources, tools and services do you need?
            </p>

            <ATATCheckboxGroup
              id="XaaSCheckboxes"
              aria-describedby="XaaSLabel"
              :value.sync="xaasSelectedOptions"
              :items="xaasCheckboxItems"
              :card="false"
              class="copy-max-width"
              :rules="[
                $validators.required('Please select at least one option.')
              ]"
            />

            <hr />

            <p id="CloudSupportLabel" class="_checkbox-group-label">
              What type(s) of cloud support packages do you need?
            </p>
            <ATATCheckboxGroup
              id="CloudSupportCheckboxes"
              aria-describedby="CloudSupportLabel"
              :value.sync="cloudSupportSelectedOptions"
              :items="cloudSupportCheckboxItems"
              :card="false"
              class="copy-max-width"
              :rules="[
                $validators.required('Please select at least one option.')
              ]"
            />

          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import PerfReqLearnMore from "./PerfReqLearnMore.vue";
import SlideoutPanel from "@/store/slideoutPanel/index";

import { Checkbox, SlideoutPanelContent } from "../../../../types/Global";
import { ServiceOfferingDTO, SystemChoiceDTO } from "@/api/models";

import DescriptionOfWork from "@/store/descriptionOfWork";
import { getIdText } from "@/helpers";

@Component({
  components: {
    ATATCheckboxGroup,
    PerfReqLearnMore,
  }
})

export default class RequirementCategories extends Vue {
  public xaasSelectedOptions: string[] = [];
  // get data from store
  private xaasCheckboxItems: Checkbox[] = [];
  private serviceOfferingGroups: SystemChoiceDTO[] = [];
  // private xaasCheckboxItems: Checkbox[] = [
  //   {
  //     id: "Compute",
  //     label: "Compute",
  //     value: "Compute", 
  //   },
  //   {
  //     id: "DeveloperToolsAndServices",
  //     label: "Developer Tools and Services",
  //     value: "DeveloperToolsAndServices", 
  //   },
  //   {
  //     id: "Applications",
  //     label: "Applications",
  //     value: "Applications", 
  //   },
  //   {
  //     id: "MachineLearning",
  //     label: "Advanced Technology and Algorithmic techniques (Machine Learning)",
  //     value: "MachineLearning", 
  //   },
  //   {
  //     id: "Networking",
  //     label: "Networking",
  //     value: "Networking", 
  //   },
  //   {
  //     id: "Security",
  //     label: "Security",
  //     value: "Security", 
  //   },
  //   {
  //     id: "DatabaseWithStorage",
  //     label: "Database with Storage",
  //     value: "DatabaseWithStorage", 
  //   },
  //   {
  //     id: "Edge",
  //     label: "Edge Computing and Tactical Edge",
  //     value: "Edge", 
  //   },
  //   {
  //     id: "IoT",
  //     label: "Internet of Things (IoT)",
  //     value: "IoT", 
  //   },
  //   {
  //     id: "General_IaaS_PaaS_SaaS",
  //     label: "General IaaS, PaaS and SaaS",
  //     value: "General_IaaS_PaaS_SaaS", 
  //     description: `Including third party marketplace and any other XaaS resources 
  //       not covered in the categories above`,
  //   },
  //   {
  //     id: "XaaSNoneApply",
  //     label: "None of these apply to my acquisition.",
  //     value: "NONE", 
  //   },
  // ];

  public cloudSupportSelectedOptions: string[] = [];
  private cloudSupportCheckboxItems: Checkbox[] = [];
  //   {
  //     id: "AdvisoryAndAssistance",
  //     label: "Advisory and assistance",
  //     value: "AdvisoryAndAssistance", 
  //   },
  //   {
  //     id: "Training",
  //     label: "Training",
  //     value: "Training", 
  //   },
  //   {
  //     id: "CloudSupportNoneApply",
  //     label: "None of these apply to my acquisition.",
  //     value: "NONE", 
  //   },
  // ];

  public openSlideoutPanel(e: Event): void {
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }

  public async loadOnEnter(): Promise<void> {
    this.serviceOfferingGroups = await DescriptionOfWork.getServiceOfferingGroups();
    this.serviceOfferingGroups.forEach((serviceOfferingGroup) => {
      const checkboxItem: Checkbox = {
        id: this.getIdText(serviceOfferingGroup.value),
        label: serviceOfferingGroup.label,
        value: serviceOfferingGroup.value
      };
      if (checkboxItem.value !== "advisory" && checkboxItem.value !== "training") {
        this.xaasCheckboxItems.push(checkboxItem);
      } else {
        this.cloudSupportCheckboxItems.push(checkboxItem);
      }
    });

    const xaasNone: Checkbox = {
      id: "XaaSNoneApply",
      label: "None of these apply to my acquisition.",
      value: "NONE", 
    }
    this.xaasCheckboxItems.push(xaasNone)

    const cloudSupportNone: Checkbox = {
      id: "CloudSupportNoneApply",
      label: "None of these apply to my acquisition.",
      value: "NONE", 
    }
    this.cloudSupportCheckboxItems.push(cloudSupportNone)



  }

  private getIdText(string: string) {
    return getIdText(string);
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
    const slideoutPanelContent: SlideoutPanelContent = {
      component: PerfReqLearnMore,
      title: "Learn More",
    };
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
  }


}
</script>

