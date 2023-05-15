<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="mb-3">
            Who conducted market research for this effort?
          </h1>
          <p>
            Provide details for each individual who conducted research below.
            You can add or remove researchers as needed.
          </p>
          <div class="d-flex copy-max-width mb-4">
            <div></div>
            <span>Name</span>
            <span>Title</span>
            <span>Organization</span>
          </div>
          <transition-group name="funding-increments" tag="div">
            <div
              v-for="(researcher, index) in researchers"
              :key="index"
              :id="'Researcher' + index"
              class="funding-increments-item"
            >
              <div class="mb-4">
                <div class="d-flex justify-space-between align-center mb-4 position-relative">
                  <span class="d-block font-weight-500 text-base mr-4 ml-1 font-size-14">
                        {{ index + 1 }}
                  </span>
                  <ATATTextField
                    :id="'Name' + index"
                    :ref="'Name' + index"
                    :value.sync="researchers[index].name"
                    :showErrorMessages="false"
                    :validateOnBlur="false"
                    width="190"
                    class="mr-7"
                    :rules="[$validators.required(nameErrorText)]"
                  />

                  <ATATTextField
                    :id="'Title' + index"
                    :ref="'Title' + index"
                    :value.sync="researchers[index].title"
                    :showErrorMessages="false"
                    :validateOnBlur="false"
                    width="190"
                    class="mr-7"
                    :rules="[$validators.required(titleErrorText)]"
                  />

                  <ATATTextField
                    :id="'Org' + index"
                    :ref="'Org' + index"
                    :value.sync="researchers[index].org"
                    :showErrorMessages="false"
                    :validateOnBlur="false"
                    width="190"
                    class="mr-7"
                    :rules="[$validators.required(orgErrorText)]"
                  />
                  <v-btn
                    :id="'DeleteIncrement' + index"
                    class="_icon-only"
                    @click="deleteResearcher(index)"
                    :disabled="researchers.length === 1"
                  >
                    <v-icon> delete </v-icon>
                  </v-btn>
                </div>
                <div>
<!--                  &lt;!&ndash; error validation for last quarter out of range &ndash;&gt;-->
<!--                  <ATATErrorValidation-->
<!--                    id="OutOfRangeAlert"-->
<!--                    class="atat-text-field-error"-->
<!--                    :errorMessages="[outOfRangeErrorMessage]"-->
<!--                    v-if="outOfRangeIndex && index === outOfRangeIndex"-->
<!--                  />-->

<!--                  &lt;!&ndash; error validation for missing first increment &ndash;&gt;-->
<!--                  <ATATErrorValidation-->
<!--                    :id="'isDuplicated_' + index"-->
<!--                    class="atat-text-field-error"-->
<!--                    :errorMessages="[errorMissingFirstIncrementMessage]"-->
<!--                    v-if="errorMissingFirstIncrement && index === 0"-->
<!--                  />-->
                </div>
              </div>
            </div>
          </transition-group>
          <v-btn
            id="AddIncrementButton"
            plain
            text
            class=" link-button no-border mt-5"
            :ripple="false"
            @click="addResearcher()"
          >
            <v-icon color="primary" class="mr-2">control_point</v-icon>
            <span>Add funding increment</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>    
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import { FairOpportunityDTO } from "@/api/models";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { hasChanges } from "@/helpers";
import _ from "lodash";

@Component({
  components: {
    ATATSVGIcon,
    ATATTextField,
    ATATErrorValidation,
  },
})

export default class WhoConductedResearch extends Vue {
  /* eslint-disable camelcase */
  public researchers:{ name: string, title: string, org: string}[] = [];
  public nameErrorText = `Enter your researcher's name.`
  public titleErrorText = `Enter your researcher's job title.`
  public orgErrorText = `Enter your researcher's organizations.`

  public isIndexZero(index:number):boolean{
    return index === 0
  }

  public addResearcher():void{
    this.researchers.push({
      name:"",
      title:"",
      org:""
    })
  }
  public deleteResearcher(index: number):void{
    if(this.researchers[index]){
      this.researchers.splice(index,1)
    }
  }
  public isResearchDataComplete(researcher:{ name: string, title: string, org: string}):boolean{
    if(researcher.org !== "" && researcher.title !== "" && researcher.org !== ""){
      return true
    }
    return false
  }
  private get currentData(): FairOpportunityDTO {
    return {
      market_research_conducted_by: JSON.stringify(this.researchers),
    } as FairOpportunityDTO;
  }

  private get savedData(): FairOpportunityDTO {
    return {
      market_research_conducted_by: AcquisitionPackage.fairOpportunity?.
        market_research_conducted_by || "",
    } as FairOpportunityDTO;
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = _.cloneDeep(AcquisitionPackage.fairOpportunity);
    if (storeData?.market_research_conducted_by) {
      this.researchers = JSON.parse(storeData.market_research_conducted_by||"")
    }else{
      this.researchers.push({
        name:"",
        title:"",
        org:""
      })
    }
  }

  protected async saveOnLeave(): Promise<boolean> {
    this.researchers.forEach((researcher,index) => {
      debugger
      if(!this.isResearchDataComplete(researcher)){
        this.deleteResearcher(index)
      }
    })
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
    console.log(this.researchers)
  }
}
</script>
