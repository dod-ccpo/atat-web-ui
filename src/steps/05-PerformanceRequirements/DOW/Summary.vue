<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          {{ heading }}
        </h1>
        <div class="copy-max-width">
          <p class="mb-10">
            {{ introText }}
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
        <div id="SelectedGroups">
          <div v-if="isXaaS">
            <div class=" d-flex justify-space-between">
              <div>
                <h3 class="mb-1" id=" AnticipatedUsersAndDataNeeds_Heading">
                  Anticipated users and data
                </h3>
              </div>
              <div class="d-flex align-start">
                <div class="d-flex align-center">
                  <div 
                    v-if="isAnticipatedUsersAndDataInvalid" 
                    class="d-flex align-start nowrap ml-5"
                  >
                    <v-icon
                      class="icon-20 text-warning-dark2 pr-2"
                    >warning</v-icon>
                    <p class="_missing-info mb-0 pr-4 _semibold">Missing info</p>
                  </div>
                  <v-btn
                    width="111"
                    :class="[
                      isAnticipatedUsersAndDataInvalid ? 'primary': 'secondary',
                      '_' + getIdText('AnticipatedUsersAndData') + '-button'
                    ]"
                    @click="routeToAnticipatedUsersAndDataNeeds()"
                    @keydown.enter="routeToAnticipatedUsersAndDataNeeds()"
                    @keydown.space="routeToAnticipatedUsersAndDataNeeds()"
                  >
                    View/Edit
                  </v-btn>

                </div>
              </div>
            </div>
            <hr/>
          </div>
          <div 
            class="container-max-width"
            :id="getIdText(item.serviceOfferingGroupId )+ '_Wrapper'"
            v-for="(item, index) in selectedServiceGroups"
            :key="item.serviceOfferingGroupId"
          >
            <div class=" d-flex justify-space-between">
              <div>
                <h3 class="mb-1" :id="getIdText(item.serviceOfferingGroupId) + '_Heading'">
                  {{getFormattedName(item.serviceOfferingGroupId)}}
                </h3>
                <p 
                  class="mb-0 _selectedOfferings" 
                  v-html="formattedOfferings(item.serviceOfferings)"
                >
                </p>
              </div>
              <div class="d-flex align-start">
                <div class="d-flex align-center">
                  <div 
                    v-if="missingData(item.serviceOfferingGroupId)" 
                    class="d-flex align-start nowrap ml-5"
                  >
                    <v-icon
                      class="icon-20 text-warning-dark2 pr-2"
                    >warning</v-icon>
                    <p class="_missing-info mb-0 pr-4 _semibold">Missing info</p>
                  </div>
                  <v-btn
                    width="111"
                    :class="[
                      missingData(item.serviceOfferingGroupId)? 'primary': 'secondary',
                      '_' + getIdText(item.serviceOfferingGroupId) + '-button'
                    ]"
                    @click="routeToSelection(item.serviceOfferingGroupId,false)"
                    @keydown.enter="routeToSelection(item.serviceOfferingGroupId,false)"
                    @keydown.space="routeToSelection(item.serviceOfferingGroupId,false)"
                  >
                    {{ missingData(item.serviceOfferingGroupId)? 'Review': 'View/Edit' }}
                  </v-btn>
                </div>
              </div>
            </div>
            <hr v-if="index !== allServiceGroups.length - 1" />
          </div>
        </div>

      </v-col>
    </v-row>
    <div id="OtherAvlGroups">

      <div 
        v-if="availableServiceGroups.length > 0" 
        class="d-flex justify-space-between align-flex-end"
      >
        <h2 class="mb-5">Other available categories</h2>
        <a
          id="ShowMoreLink"
          class="expandable-content-opener mt-1 _text-decoration-none"
          :class="[{ 'open' : showMore }]"
          v-show="availableServiceGroups.length > 4"
          @click="showMore = !showMore"
          @keydown.enter="showMore = !showMore"
          @keydown.space="showMore = !showMore"
        >
          Show {{ showMore ? "less" : "more" }}
        </a>
      </div>

      <v-row v-if="availableServiceGroups.length > 0">
        <v-col
          cols="3"
          style="padding: 10px; !important"
          v-for="(group, index) in availableServiceGroups"
          :key="index"
          v-show="index <= 3 || showMore"
        >
          <div 
            class="_simple-card d-flex flex-column justify-space-between"
            :id="getIdText(group.value) + '_Wrapper'"
          >
            <div class="d-flex justify-space-between mb-2">
              <div class="h3" :id="getIdText(group.value) + '_Heading'" >
                {{ group.label }}
              </div>

              <div class="pl-2">
                <ATATTooltip
                  :tooltipText="getTooltipText(group.value)"
                  :id="getIdText(group.value)"
                  :label="group.label"
                />
              </div>
            </div>

            <div>
              <a
                class="_chevron-right-after"
                :id="getIdText(group.value) + '_Link'"
                role="link"
                @click="routeToSelection(group.value, true)"
                @keydown.enter="routeToSelection(group.value, true)"
                @keydown.space="routeToSelection(group.value, true)"
                tabindex="0"
              >
                Add requirements
              </a>
            </div>

          </div>

        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
<script lang="ts">
/*eslint prefer-const: 1 */
import { routeNames } from "../../../router/stepper"
import { Component, Mixins } from "vue-property-decorator";
import SaveOnLeave from "@/mixins/saveOnLeave";
import _ from "lodash";
import classificationRequirements from "@/store/classificationRequirements";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATTooltip from "@/components/ATATTooltip.vue"
import DOWAlert from "@/steps/05-PerformanceRequirements/DOW/DOWAlert.vue";
import { DOWServiceOffering, DOWServiceOfferingGroup } from "../../../../types/Global";
import Periods from "@/store/periods";
import DescriptionOfWork from "@/store/descriptionOfWork";
import Steps from "@/store/steps";
import { SystemChoiceDTO } from "@/api/models";
import { getIdText, toTitleCase } from "@/helpers";
import ClassificationRequirements from "@/store/classificationRequirements";
// import router from "@/router";

@Component({
  components: {
    ATATAlert,
    ATATTooltip,
    DOWAlert,
  }
})

export default class Summary extends Mixins(SaveOnLeave) {
  private isPeriodsDataMissing = false;
  private isClassificationDataMissing = false;
  private showAlert = false;
  private routeNames = routeNames;
  public serviceGroupsMissingData: string[] =[]
  public availableServiceGroups: SystemChoiceDTO[] = [];
  public allServiceGroups: SystemChoiceDTO[] = [];
  public selectedServiceGroups: DOWServiceOfferingGroup[] = [];
  public showMore = false;
  public isDataComplete = true;
  public heading = "";
  public introText = "";
  public showAnticipatedUserAndDataNeeds = false;
  public isXaaS = false;

  public alternateGroupNames = [
    {
      value: "MACHINE_LEARNING",
      label: "Machine Learning",
    },
    {
      value: "IOT",
      label: "Internet of Things",
    },
    {
      value: "GENERAL_XAAS",
      label: "General IaaS, PaaS, and SaaS"
    }
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

  get isAnticipatedUsersAndDataInvalid():boolean{
    return ClassificationRequirements.selectedClassificationLevels.some(
      cl => cl.isValid === undefined || cl.isValid === false
    )
  }

  public getTooltipText(value: string): string {
    const tooltipObj =  this.tooltipText.find(e => e.value === value);
    return tooltipObj ? tooltipObj.text : "";
  }

  public getIdText(val: string): string {
    return getIdText(toTitleCase(val));
  }
  public async routeToAnticipatedUsersAndDataNeeds(): Promise<void> {
    DescriptionOfWork.setReturnToDOWSummary(true);
    DescriptionOfWork.setFromAnticipatedUsersAndData(true);
    DescriptionOfWork.setReviewGroupFromSummary(true);
    this.$router.push({
      name: routeNames.AnticipatedUserAndDataNeeds,
      params: {
        direction: "next"
      },
    }).catch((error) => console.log("Routing error:" + error));
  }
  public async routeToSelection(groupID: string, addToStore:boolean ): Promise<void> {
    DescriptionOfWork.setCurrentOfferingGroupId(groupID);
    if (addToStore){
      DescriptionOfWork.addOfferingGroup(groupID);
      DescriptionOfWork.setAddGroupFromSummary(true);
    } else {
      DescriptionOfWork.setReviewGroupFromSummary(true);
    }

    DescriptionOfWork.setReturnToDOWSummary(true);
    DescriptionOfWork.setFromAnticipatedUsersAndData(false);

    this.$router.push({
      name: "pathResolver",
      params: {
        resolver: "ServiceOfferingsPathResolver",
        direction: "next"
      },
    }).catch((error) => console.log("Routing error:" + error));
  };

  public getFormattedName(value: string): string {
    const altNameIndex = this.alternateGroupNames.findIndex((altObj) => {
      return altObj.value === value;
    });
    if (altNameIndex > -1) {
      return this.alternateGroupNames[altNameIndex].label;
    }
    const filtered = this.allServiceGroups.find(obj => obj.value == value);
    return filtered ? filtered.label : "";
  };

  public formattedOfferings(value: DOWServiceOffering[]): string {
    const serviceArr = value
      .map(obj => obj.name === "Other"?
        ` <span class="_selectedOffering">${obj.otherOfferingName}</span>`:
        ` <span class="_selectedOffering">${obj.name}</span>`);
    
    return serviceArr.join();
  };

  public setSelectedGroupsMissingData(value: DOWServiceOfferingGroup[]): void {
    //eslint-disable-next-line prefer-const
    let outputArr :string[] = [];
    value.forEach((obj)=>{
      //eslint-disable-next-line prefer-const
      let id = obj.serviceOfferingGroupId;
      if (this.isClassificationDataMissing || 
        (obj.serviceOfferings.length === 0 && !obj.otherOfferingData) ||
        (obj.otherOfferingData && obj.otherOfferingData.length === 0)) {
        outputArr.push(id);
      } else if (obj.otherOfferingData && obj.otherOfferingData.length >0){
        const isIncomplete = obj.otherOfferingData.some(
          ood => !ood.isComplete
        )
        if (isIncomplete){
          outputArr.push(id);
        }
      } else {
        obj.serviceOfferings.forEach((offering)=>{
          if(offering.classificationInstances && offering.classificationInstances.length === 0) {
            if(outputArr.indexOf(id) < 0){
              outputArr.push(id);
            };
          } else {
            offering.classificationInstances?.forEach((instance)=>{
              if(instance.anticipatedNeedUsage === ''|| instance.entireDuration === '') {
                if(outputArr.indexOf(id) < 0){
                  outputArr.push(id);
                };
              } else if (instance.entireDuration === 'NO' && !instance.selectedPeriods?.length){
                if(outputArr.indexOf(id) < 0){
                  outputArr.push(id);
                }
              };
            });
          }
        });
      }
    });
    this.serviceGroupsMissingData = outputArr;
  };

  public missingData(value: string): boolean {
    return this.serviceGroupsMissingData.includes(value) ? true : false;
  };

  public async loadOnEnter(): Promise<void> {
    this.isXaaS = DescriptionOfWork.currentDOWSection === "XaaS";
    this.heading = this.isXaaS ? "Your XaaS Summary" : "Your Cloud Support Package";
    const introTextSubstr = this.isXaaS ? "XaaS requirements" : "support services";
    this.introText = `You are all done with your ${introTextSubstr}, but you can 
        come back at any time to edit details. When you are ready, we’ll review 
        your performance requirements summary.`;

    DescriptionOfWork.setCurrentGroupRemoved(false);
    DescriptionOfWork.setCurrentGroupRemovedForNav(false);
    DescriptionOfWork.setReturnToDOWSummary(false);
    DescriptionOfWork.setFromAnticipatedUsersAndData(false);
    DescriptionOfWork.setLastGroupRemoved(false);

    const periods = await Periods.loadPeriods();
    const classifications = await classificationRequirements.getSelectedClassificationLevels();
    if (periods && periods.length <= 0) {
      this.showAlert = true;
      this.isPeriodsDataMissing = true;
    };
    if (classifications && classifications.length <= 0) {
      this.showAlert = true;
      this.isClassificationDataMissing = true;
    };

    let selectedOfferingGroups: string[] = _.clone(DescriptionOfWork.selectedServiceOfferingGroups);
    const sectionServices = this.isXaaS 
      ? DescriptionOfWork.xaasServices : DescriptionOfWork.cloudSupportServices;
    selectedOfferingGroups = selectedOfferingGroups.filter(id => sectionServices.includes(id));

    this.allServiceGroups = _.cloneDeep(DescriptionOfWork.serviceOfferingGroups).filter(
      obj => sectionServices.includes(obj.value));

    this.availableServiceGroups = this.allServiceGroups.filter((serviceGroup) => {
      return selectedOfferingGroups.indexOf(serviceGroup.value) === -1;
    });
    this.availableServiceGroups.forEach((group) => {
      const altNameIndex = this.alternateGroupNames.findIndex((altObj) => {
        return altObj.value === group.value;
      });
      if (altNameIndex > -1) {
        group.label = this.alternateGroupNames[altNameIndex].label;
      }
    });
    this.selectedServiceGroups = DescriptionOfWork.DOWObject.filter(
      e => e.serviceOfferingGroupId.indexOf("NONE") === -1 
      && sectionServices.includes(e.serviceOfferingGroupId) 
    );

    this.setSelectedGroupsMissingData(this.selectedServiceGroups);

  };

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
    this.setIsIncomplete();
  };

  public setIsIncomplete(): void {
    DescriptionOfWork.setIsIncomplete(
      this.serviceGroupsMissingData.length>0
    );
  }

  protected async saveOnLeave(): Promise<boolean> {
    Steps.clearAltBackButtonText();
    return true;
  }

};
</script>
