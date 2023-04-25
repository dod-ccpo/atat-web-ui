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
            <section id="">
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
                  additional time and cost fields
                </div>
              </v-expand-transition>
            </section>

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
                govt engineers trained etc fields
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

        </v-col>
      </v-row>
    </v-container>    
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Mixins, Watch } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { RadioButton } from "types/Global";
import { FairOpportunityDTO } from "@/api/models";
import { getYesNoRadioOptions, hasChanges } from "@/helpers";
import AcquisitionPackage from "@/store/acquisitionPackage";
import _ from "lodash";
import SaveOnLeave from "@/mixins/saveOnLeave";


@Component({
  components: {
    ATATRadioGroup
  }
})

export default class SoleSourceCause extends Mixins(SaveOnLeave) {
  public cspName = "";
  public addlTimeCostOptions: RadioButton[] = getYesNoRadioOptions("AddlTimeCost");
  public requiresAddlTimeCost = false;

  public govtEngineersOptions: RadioButton[] = getYesNoRadioOptions("GovtEngineers");
  public govtEngineersTrained = false;

  public productFeatureOptions: RadioButton[] = getYesNoRadioOptions("ProdFeat");
  public hasPeculiarProduct = false;

  @Watch("currentData", {deep: true})
  public currentDataChanged(newVal: FairOpportunityDTO): void {
    this.requiresAddlTimeCost 
      = newVal.cause_migration_addl_time_cost === "YES" ? true : false;
    this.govtEngineersTrained 
      = newVal.cause_govt_engineers_training_certified === "YES" ? true : false;
    this.hasPeculiarProduct 
      = newVal.cause_product_feature_peculiar_to_csp === "YES" ? true : false;

  }


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

