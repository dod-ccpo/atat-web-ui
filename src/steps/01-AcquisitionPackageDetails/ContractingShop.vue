<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header mb-3">
            Are you using the Defense Information Technology 
            Contracting Organization (DITCO) for processing 
            your JWCC task order?
          </h1>
          <div class="copy-max-width">
            <p class="mb-0">
              Documents that are generated upon completion of this form are 
              intended for DITCO. If you plan to use another Contracting Office, 
              we recommend that you verify that they will accept DITCO templates 
              for processing a JWCC task order before proceeding. 
              <a
                role="button"
                id="ContractingShopLearnMore"
                class="_text-link"
                tabindex="0"
                @click="openSlideoutPanel"
                @keydown.enter="openSlideoutPanel"
                @keydown.space="openSlideoutPanel">
                Learn more
              </a>
            </p>
          </div>
 
          <div class="mt-10">
            <ATATRadioGroup 
              id="ContractingShopChoice"
              name="ContractingShopChoice"
              :items="contractingShopOptions"
              :value.sync="contractingShop"
              :card="true"
              width="400"
              :rules="[$validators.required('Please select an option.')]"
            />
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div v-if="contractingShop === 'OTHER'">
            <ATATAlert 
              id="ContractingShopWarningAlert"
              type="warning"
              :showIcon="true"
            >
              <template v-slot:content>
                <p class="mr-5 mb-0">
                  Your Contracting Office may require specific templates for processing 
                  task orders within their organization. Before proceeding, please verify 
                  that your Contracting Office will accept DITCO acquisition package 
                  templates.
                </p>
              </template>
            </ATATAlert>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import SaveOnLeave from "@/mixins/saveOnLeave";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import SlideoutPanel from "@/store/slideoutPanel/index";
import { SlideoutPanelContent, RadioButton } from "../../../types/Global";
import ContractingShopLearnMore from "./ContractingShopLearnMore.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({
  components: {
    ATATRadioGroup,
    ATATAlert,
    ContractingShopLearnMore
  }
})
export default class ContractingShop extends Mixins(SaveOnLeave) {

  public contractingShopOptions: RadioButton[] = [
    {
      id: "DITCO",
      label: "Yes.",
      value: "DITCO"
    },
    {
      id: "OTHER",
      label: "No. I plan to use another Contracting Office.",
      value: "OTHER"
    }
  ];

  public contractingShop = "";

  public openSlideoutPanel(e: Event): void {
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }

  private async loadOnEnter(): Promise<void> {

    const packageId = this.$route.query['packageId'] || "";

    if(packageId){
      await AcquisitionPackage.reset();
      await AcquisitionPackage.setPackageId(packageId as string);
      await AcquisitionPackage.loadPackageFromId(packageId as string);
    }

    this.contractingShop = AcquisitionPackage.contractingShop || "";
  }

  public async mounted(): Promise<void> {
    const slideoutPanelContent: SlideoutPanelContent = {
      component: ContractingShopLearnMore,
      title: "Learn More",
    };
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
    await this.loadOnEnter();
  }

  protected async saveOnLeave(): Promise<boolean> {
    await AcquisitionPackage.setContractingShop(this.contractingShop);
    await AcquisitionPackage.saveAcquisitionPackage();
    return true;
  }
}
</script>