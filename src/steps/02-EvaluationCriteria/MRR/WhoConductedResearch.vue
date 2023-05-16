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
          <v-row>
            <v-col>Name</v-col>
            <v-col>Job title</v-col>
            <v-col>Organization</v-col>
          </v-row>
          <transition-group name="funding-increments" tag="div">
            <v-row
              v-for="(researcher, index) in researchers"
              :key="index"
              :id="'Researcher' + index"
              class="
              researcher-table
              pa-2
              researcher-table-row"
            >
                <v-col
                  cols="1"
                  class="d-block
                  font-weight-500
                  text-base
                  mr-4
                  ml-1
                  col-1
                  font-size-14"
                  :class="index===0?'mt-6':''"
                >
                      {{ index + 1 }}
                </v-col>
                <v-col cols="3">
                  <ATATTextField
                    :id="'Name' + index"
                    :ref="'Name' + index"
                    :label="index === 0?'Name':''"
                    :value.sync="researchers[index].name"
                    width="190"
                    class="mr-7"
                    :rules="index === 0?[$validators.required(nameErrorText)]:[]"
                  />
                </v-col>
                <v-col cols="3">
                  <ATATTextField
                    :id="'Title' + index"
                    :ref="'Title' + index"
                    :label="index === 0?'Job title':''"
                    :value.sync="researchers[index].title"
                    width="190"
                    class="mr-7"
                    :rules="index === 0?[$validators.required(titleErrorText)]:[]"
                  />
                </v-col>
                <v-col cols="3">
                  <ATATTextField
                    :id="'Org' + index"
                    :ref="'Org' + index"
                    :label="index === 0?'Organization':''"
                    :value.sync="researchers[index].org"
                    width="190"
                    class="mr-7"
                    :rules="index === 0?[$validators.required(orgErrorText)]:[]"
                  />
                </v-col>
                <v-col class="col-1">
                  <v-btn
                    :id="'DeleteIncrement' + index"
                    class="_icon-only"
                    :class="index===0?'mt-6':''"
                    @click="deleteResearcher(index)"
                    :disabled="researchers.length === 1"
                  >
                    <v-icon> delete </v-icon>
                  </v-btn>
                </v-col>
            </v-row>
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
            <span>Add another researcher</span>
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
    return researcher.org !== "" && researcher.title !== "" && researcher.org !== "";
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
