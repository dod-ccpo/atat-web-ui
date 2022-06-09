<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Your Performance Requirements
        </h1>
        <div class="copy-max-width">
          <p class="mb-10">
            We need some more details for this section. You can add info now, or come back to make
            edits at any time. When you are ready to wrap up this section, we will move on to
            government furnished equipment.
          </p>
        </div>
        <div class="container-max-width">
          <DOWAlert
            v-show="showAlert"
            :isPeriodsDataMissing="isPeriodsDataMissing"
            :isClassificationDataMissing="isClassificationDataMissing"
            summaryPage=true
          />
        </div>
      </v-col>
    </v-row>

    <hr />
    <div class="d-flex justify-space-between align-flex-end">
      <h2 class="mb-5">Other available categories</h2>
      <a 
        id="ShowMoreLink"
        class="expandable-content-opener mb-5"
        :class="[{ 'open' : showMore }]"
        v-show="availableServiceGroups.length > 4"
        @click="showMore = !showMore"
        @keydown.enter="showMore = !showMore"
        @keydown.space="showMore = !showMore"
      >
        Show {{ showMore ? "less" : "more" }}
      </a>
    </div>  

    <v-row>
      <v-col
        cols="3"
        style="padding: 10px; !important"
        v-for="(group, index) in availableServiceGroups" 
        :key="index"   
        v-show="index <= 3 || showMore"  
      >
        <div class="_simple-card d-flex flex-column justify-space-between">
          <div class="d-flex justify-space-between">
            <div class="h3 mb-2 ">
              {{ group.label }}
            </div>

            <div class="pl-2">
              <ATATTooltip 
                :tooltipText="getTooltipText(group.value)"
                :id="group.value" 
                :label="group.label"
              />
            </div>
          </div>

          <div>
            <a 
              class="_chevron-right-after"
              :id="group.value + '_link'"
              role="link"
              @click="routeToSelection(group.value)"
              @keydown.enter="routeToSelection(group.value)"
              @keydown.space="routeToSelection(group.value)"
              tabindex="0"
            >
              Add requirements
            </a>
          </div>

        </div>
      
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";
import { routeNames } from "../../../router/stepper"
import { Component } from "vue-property-decorator";

import classificationRequirements from "@/store/classificationRequirements";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATTooltip from "@/components/ATATTooltip.vue"
import DOWAlert from "@/steps/05-PerformanceRequirements/DOW/DOWAlert.vue";

import Periods from "@/store/periods";
import { DOWServiceOfferingGroup } from "../../../../types/Global";
import DescriptionOfWork from "@/store/descriptionOfWork";
import { SystemChoiceDTO } from "@/api/models";
// import router from "@/router";  

@Component({
  components: {
    ATATAlert,
    ATATTooltip,
    DOWAlert,
  }
})
export default class Summary extends Vue {
  private isPeriodsDataMissing = false;
  private isClassificationDataMissing = false;
  private showAlert = false;
  private routeNames = routeNames;

  public availableServiceGroups: SystemChoiceDTO[] = [];
  public allServiceGroups: SystemChoiceDTO[] = [];
  public DOWObject: DOWServiceOfferingGroup[] = DescriptionOfWork.DOWObject;
  public showMore = false;

  public alternateGroupNames = [
    {
      value: "MACHINE_LEARNING",
      label: "Machine Learning",
    },
    {
      value: "EDGE_COMPUTING",
      label: "Edge Computing and Tactical Edge",
    },
    {
      value: "IOT",
      label: "Internet of Things",
    },
  ];

  public tooltipText = [
    {
      value: "COMPUTE",
      text: `This category includes processing power, memory, storage, regions, 
        and more for computing instances.`
    },
    {
      value: "DEVELOPER_TOOLS",
      text: `This category includes DevSecOPS, data management, migration tools, 
        transformation tools, cloud development tools, cloud audit monitoring tools,
        and cyber tools.`
    },
    {
      value: "APPLICATIONS",
      text: `This category includes applications, web apps, databases, monitoring 
        tools, discrete PaaS, and discrete SaaS.`
    },
    {
      value: "MACHINE_LEARNING",
      text: `This category includes specialized tools, applications, PaaS and SaaS.`
    },
    {
      value: "NETWORKING",
      text: `This category includes CSP, hybrid, and custom networks.`
    },
    {
      value: "SECURITY",
      text: `This category includes security services, CSP cloud security, Zero 
        Trust/Permissive Trust security, and custom security options.`
    },
    {
      value: "DATABASE",
      text: `This category includes database services, horizontal, vertical, and 
        graph databases.`
    },
    {
      value: "EDGE_COMPUTING",
      text: `This category includes remotable, mobile, and perimeter technology, 
        as well as conditional flag indicating military hardening.`
    },
    {
      value: "IOT",
      text: `This category includes IoT Edge, IoT SaaS, and IoT PaaS.`
    },
    {
      value: "GENERAL_XAAS",
      text: `This category encompasses other Infrastructure as a Service, Platform 
        as a Service, and Software as a Service requirements not covered by the other 
        categories, to include third party marketplace.`
    },
    {
      value: "ADVISORY",
      text: `This category customizes advisory support packages based on the level 
        of complexity for your challenge.`
    },
    {
      value: "TRAINING",
      text: `This category customizes support packages for location and web-based 
        training requirements.`
    },
  ];

  public getTooltipText(value: string): string {
    const tooltipObj =  this.tooltipText.find(e => e.value === value);
    return tooltipObj ? tooltipObj.text : "";
  }

  public async routeToSelection(value: string): Promise<void> {
    DescriptionOfWork.setCurrentOfferingGroupId(value);
    DescriptionOfWork.addOfferingGroup(value);
    DescriptionOfWork.setReturnToDOWSummary(true);
    DescriptionOfWork.setAddingGroupFromSummary(true);

    this.$router.push({
      name: "pathResolver",
      params: {
        resolver: "OfferGroupOfferingsPathResolver",
        direction: "next"
      },
    }).catch((error) => console.log("Routing error:" + error));
  }

  public async loadOnEnter(): Promise<void> {
    const periods = await Periods.loadPeriods();
    const classifications = await classificationRequirements.getSelectedClassificationLevels()
    if (periods && periods.length <= 0) {
      this.showAlert = true
      this.isPeriodsDataMissing = true
    };
    if (classifications && classifications.length <= 0) {
      this.showAlert = true
      this.isClassificationDataMissing = true
    };
    
    const selectedOfferingGroups: string[] = DescriptionOfWork.selectedServiceOfferingGroups;
    this.allServiceGroups = DescriptionOfWork.serviceOfferingGroups;
    this.availableServiceGroups = this.allServiceGroups.filter((serviceGroup) => {
      return selectedOfferingGroups.indexOf(serviceGroup.value) === -1
    });
    this.availableServiceGroups.forEach((group) => {
      const altNameIndex = this.alternateGroupNames.findIndex((altObj) => {
        return altObj.value === group.value;
      });
      if (altNameIndex > -1) {
        group.label = this.alternateGroupNames[altNameIndex].label;
      }
    });
  };

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  };
}
</script>

