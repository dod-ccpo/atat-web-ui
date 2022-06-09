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
        <div class="copy-max-width" v-for="(item) in this.DOWObject"
              :key="item.serviceOfferingGroupId">
          <div class=" d-flex justify-space-between">
            <div>
              <h4>
                {{getFormattedNames(item.serviceOfferingGroupId)}}
              </h4>
              <p class="mb-0">
                {{formattedOfferings(item.serviceOfferings)}}
              </p>
            </div>
            <div class="d-flex">
              <div v-if="missingData(item.serviceOfferingGroupId)" class="d-flex align-start mt-1">
                <v-icon
                  class="icon-20 text-warning-dark2 pr-2"
                >warning</v-icon>
                <p class="mb-0 pr-4">Missing info</p>
              </div>
              <v-btn
              :class="missingData(item.serviceOfferingGroupId)? 'primary': 'secondary'">
                {{ missingData(item.serviceOfferingGroupId)? 'Review': 'View/Edit' }}
              </v-btn>
            </div>
          </div>
          <hr />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";
import { routeNames } from "../../../router/stepper"
import { Component } from "vue-property-decorator";
import Periods from "@/store/periods";
import classificationRequirements from "@/store/classificationRequirements";
import ATATAlert from "@/components/ATATAlert.vue";
import DOWAlert from "@/steps/05-PerformanceRequirements/DOW/DOWAlert.vue";
import DescriptionOfWork from "@/store/descriptionOfWork";
import { DOWServiceOffering, DOWServiceOfferingGroup, stringObj } from "../../../../types/Global";


@Component({
  components: {
    ATATAlert,
    DOWAlert,

  }
})
export default class Summary extends Vue {
  private isPeriodsDataMissing = false
  private isClassificationDataMissing = false
  private showAlert = false
  private routeNames = routeNames
  public DOWObject: DOWServiceOfferingGroup[] = DescriptionOfWork.DOWObject;
  public instancesMissingData: string[] =[]

  public getFormattedNames(value: string): string{
    const avlOfferings = DescriptionOfWork.serviceOfferingGroups
    const filtered = avlOfferings.filter(obj => obj.value == value)
    return filtered[0].label
  }

  public formattedOfferings(value: DOWServiceOffering[]): string {
    const serviceArr = value.map(obj => ` ${obj.name}`)
    return serviceArr.join()
  }

  public labelsMissingData(value: DOWServiceOfferingGroup[]): void {
    let outputArr :string[] = []
    value.forEach((obj)=>{
      let id = obj.serviceOfferingGroupId
      obj.serviceOfferings.forEach((offering)=>{
        offering.classificationInstances?.forEach((instance)=>{
          if(instance.anticipatedNeedUsage === '') {
            outputArr.push(id)
          }
          else if(instance.entireDuration === '') {
            outputArr.push(id)
          }
          else if(instance.entireDuration === 'NO' && !instance.selectedPeriods?.length){
            outputArr.push(id)
          };
        });
      })
    })
    console.log(outputArr)
    this.instancesMissingData = outputArr
  }

  public missingData(value :string) {
    // 23f
    if(this.instancesMissingData.includes(value)){
      return true
    } else{
      return false
    }
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
  };

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
    this.labelsMissingData(this.DOWObject)
    this.missingData('')
  };
}
</script>

