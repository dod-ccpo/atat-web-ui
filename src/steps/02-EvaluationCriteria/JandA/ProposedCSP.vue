<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Which CSP does this exception to fair opportunity apply to?
          </h1>
          <div class="d-flex">
            <v-card 
              v-for="(csp, index) in csps" 
              :key="index" 
              class="_csp-card _selectable"
              :class="{ '_selected' : csp.selected }"
              @click="cspCardClicked(index)"
            >
              <div class="_svg-icon-div">
              <ATATSVGIcon 
                id="Azure" 
                :name="csp.iconName"
                class="svg-icon"
                :width="csp.width" 
                :height="csp.height" />
              </div>
              <h3 class="_csp-name"> {{ csp.name }}</h3>
            </v-card>
          </div>

        </v-col>
      </v-row>
    </v-container>    
  </v-form>
</template>

<script lang="ts">
import { FairOpportunityDTO } from "@/api/models";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { hasChanges } from "@/helpers";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { Component, Mixins } from "vue-property-decorator";
import { CSP } from "../../../../types/Global";
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATSVGIcon,
  }
})

export default class ProposedCSP extends Mixins(SaveOnLeave) {
  public selectedCSP: CSP = "";

  public csps = [
    {
      name: "Amazon Web Services (AWS)",
      iconName: "aws",
      width: "64",
      height: "39",
      selected: false,
    },
    {
      name: "Google Cloud",
      iconName: "gcp",
      width: "62",
      height: "50",
      selected: false,
    },
    {
      name: "Microsoft Azure",
      iconName: "azure",
      width: "60",
      height: "56",
      selected: false,
    },                
    {
      name: "Oracle Cloud",
      iconName: "oracle",
      width: "64",
      height: "41",
      selected: false,
    }
  ];

  public cspCardClicked(index: number): void {
    this.csps.forEach(c => c.selected = false);
    this.csps[index].selected = true;
    this.selectedCSP = this.csps[index].iconName.toUpperCase() as CSP;
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
    const storeData = AcquisitionPackage.fairOpportunity;
    if (storeData) {
      this.selectedCSP = storeData.proposed_csp;
      const index = this.csps.findIndex(obj => obj.iconName === this.selectedCSP?.toLowerCase());
      if (index > -1) {
        this.csps[index].selected = true;
      }
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
