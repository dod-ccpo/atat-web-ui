<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Which CSP does this exception to fair opportunity apply to?
          </h1>

          <v-radio-group
            class="_atat-radio-group _inline"
            ref="radioButtonGroup"
            :rules="[$validators.required('Please select a CSP.')]"
            v-model="selectedCSP"
          >
            <v-radio
              v-for="(csp, index) in cspOptions"
              :key="index"
              :value="csp.value"
              :id="csp.value + 'Button'"
              name="cspRadios"
              class="_csp-card d-flex inline"
              @click="onClick"
              @blur="onBlur"
            >
              <template v-slot:label>
                <div class="_svg-icon-div">
                  <ATATSVGIcon 
                    :id="csp.value + 'Icon'" 
                    :name="csp.iconName"
                    class="svg-icon"
                    :width="csp.width" 
                    :height="csp.height" 
                  />
                </div>
                <h3 class="_csp-name"> {{ csp.name }}</h3>
              </template>
            </v-radio>
          </v-radio-group>
          <ATATErrorValidation :errorMessages="errorMessages" />

        </v-col>
      </v-row>
    </v-container>    
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";

import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

import { hasChanges } from "@/helpers";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { Component, Mixins, Watch } from "vue-property-decorator";
import { CSP } from "../../../../types/Global";
import SaveOnLeave from "@/mixins/saveOnLeave";
import _ from "lodash";
import { FairOpportunityDTO } from "@/api/models";

@Component({
  components: {
    ATATErrorValidation,
    ATATSVGIcon,
  }
})

export default class ProposedCSP extends Mixins(SaveOnLeave) {
  // refs
  $refs!: {
    radioButtonGroup: Vue & { 
      errorBucket: string[]; 
      errorCount: number;
      validate: () => boolean;
      resetValidation: () => boolean;
    };
  }; 

  public selectedCSP: CSP = "";
  private errorMessages: string[] = [];

  public cspOptions = [
    {
      value: "AWS",
      name: "Amazon Web Services (AWS)",
      iconName: "aws",
      width: "64",
      height: "39",
      selected: false,
    },
    {
      value: "GCP",
      name: "Google Cloud",
      iconName: "gcp",
      width: "62",
      height: "50",
      selected: false,
    },
    {
      value: "AZURE",
      name: "Microsoft Azure",
      iconName: "azure",
      width: "60",
      height: "56",
      selected: false,
    },                
    {
      value: "ORACLE",
      name: "Oracle Cloud",
      iconName: "oracle",
      width: "64",
      height: "41",
      selected: false,
    }
  ];

  public get validateFormNow(): boolean {
    return AcquisitionPackage.getValidateNow;
  }

  @Watch('validateFormNow')
  public validateNowChange(): void {
    if(!this.$refs.radioButtonGroup.validate())
      this.setErrorMessage();
  }
  public setErrorMessage(): void {
    this.errorMessages = this.$refs.radioButtonGroup.errorBucket;
  }

  private onBlur(): void {
    if (this.$refs && this.$refs.radioButtonGroup) {
      this.setErrorMessage();
    }
  }
  private onClick(): void {
    this.errorMessages = [];
  } 
  private get currentData(): FairOpportunityDTO {
    return {
      // eslint-disable-next-line camelcase
      proposed_csp: this.selectedCSP,
    };
  }

  private get savedData(): FairOpportunityDTO {
    return {
      // eslint-disable-next-line camelcase
      proposed_csp: AcquisitionPackage.fairOpportunity?.proposed_csp || "",
    };
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = _.cloneDeep(AcquisitionPackage.fairOpportunity);
    if (storeData) {
      this.selectedCSP = storeData.proposed_csp;
    }
  }

  protected async saveOnLeave(): Promise<boolean> {
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
