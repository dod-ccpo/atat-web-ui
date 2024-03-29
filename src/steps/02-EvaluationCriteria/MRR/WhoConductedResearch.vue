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
          <div class="d-flex width-100 pa-2">
            <div style="min-width: 30px; max-width: 30px;">&nbsp;</div>
            <div style="width: 33%" class="pl-2 font-weight-500">Name</div>
            <div style="width: 33%" class="pl-2 font-weight-500">Job title</div>
            <div style="width: 33%" class="pl-2 font-weight-500">Organization</div>
            <div style="min-width: 40px; max-width: 40px;">&nbsp;</div>
          </div>
          <div class="researcher-table width-100">
            <transition-group name="funding-increments" tag="div">
              <div
                v-for="(researcher, index) in researchers"
                :key="index"
                :id="'Researcher' + index"
                class="d-flex width-100 researcher-table-row pa-2 pt-3"
              >
                <div
                  class="font-weight-500 text-base font-size-14 d-flex justify-center"
                  style="min-width: 30px; max-width: 30px;"
                >
                  <div class="mr-2" style="margin-top: 6px;">
                    {{ index + 1 }}
                  </div>
                </div>

                <div style="width: 33%" class="mr-6">
                  <ATATTextField
                    :id="'Name' + index"
                    :ref="'Name' + index"
                    :value="researchers[index].name"
                    @update:value="researchers[index].name = $event"
                    :rules="index === 0?[$validators.required(nameErrorText)]:[]"
                  />
                </div>
                <div style="width: 33%" class="mr-6">
                  <ATATTextField
                    :id="'Title' + index"
                    :ref="'Title' + index"
                    :value="researchers[index].title"
                    @update:value="researchers[index].title = $event"
                    :rules="index === 0?[$validators.required(titleErrorText)]:[]"
                  />
                </div>
                <div style="width: 33%" class="mr-4">
                  <ATATTextField
                    :id="'Org' + index"
                    :ref="'Org' + index"
                    :value="researchers[index].org"
                    @update:value="researchers[index].org = $event"
                    :rules="index === 0?[$validators.required(orgErrorText)]:[]"
                  />
                </div>
                <div style="min-width: 40px; max-width: 40px;">
                  <v-btn
                    :id="'DeleteIncrement' + index"
                    class="_icon-only"
                    @click="deleteResearcher(index)"
                    :disabled="researchers.length === 1"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </div>
            </transition-group>
          </div>
          <v-btn
            id="AddIncrementButton"
            variant="plain"
            class=" link-button no-border mt-5"
            :ripple="false"
            @click="addResearcher()"
          >
            <v-icon color="primary" class="mr-2">mdi-plus-circle-outline</v-icon>
            <span>Add another researcher</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>    
  </v-form>
</template>

<script lang="ts">
import { Component, Hook, Vue, toNative } from "vue-facing-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import { FairOpportunityDTO } from "@/api/models";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { hasChanges } from "@/helpers";
import _ from "lodash";
import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";
import { SaveOnLeaveRefs } from 'types/Global'

@Component({
  components: {
    ATATSVGIcon,
    ATATTextField,
    ATATErrorValidation,
  },
})

class WhoConductedResearch extends Vue {

  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs, 
      nextTick: this.$nextTick,
    }).catch()
  }

  /* eslint-disable camelcase */
  public researchers:{ name: string, title: string, org: string}[] = [];
  public savedResearchers = ""
  public nameErrorText = `Enter your researcher’s name.`
  public titleErrorText = `Enter your researcher’s job title.`
  public orgErrorText = `Enter your researcher’s organizations.`


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
      if(index === 0){
        (this.$refs.form as SaveOnLeaveRefs['form']).resetValidation?.();
      }
    }
  }
  public isResearchDataComplete(researcher:{ name: string, title: string, org: string}):boolean{
    return researcher.name !== "" && researcher.title !== "" && researcher.org !== "";
  }
  private get currentData(): FairOpportunityDTO {
    const researchValue = this.researchers.length == 0 ? "":JSON.stringify(this.researchers)

    return {
      market_research_conducted_by: researchValue,
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
      this.researchers = JSON.parse(storeData.market_research_conducted_by)
    }else{
      this.researchers = [
        {
          name:"",
          title:"",
          org:""
        }
      ]
    }
  }

  protected async saveOnLeave(): Promise<boolean> {
    if(this.researchers.length > 1){
      this.researchers.forEach((researcher,index) => {
        if(!this.isResearchDataComplete(researcher)){
          this.deleteResearcher(index)
        }
      })
    }
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

export default toNative(WhoConductedResearch)
</script>
