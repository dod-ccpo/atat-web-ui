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
            <p class="mb-6">
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

    <v-dialog
      v-model="isLoading"
      :max-width="'640px'"
      persistent
      id="LoadingDialog"
    >
      <v-card style="padding: 80px 100px">
        <div class="text-center">
          <div class="h1 mb-4" id="LoadingModalTitle">
            Loading your package details<span class="ellipsis"></span>
          </div>
          <p>Please wait while we finish getting your package ready.</p>
          <div class="px-4">
            <v-progress-linear
              :value="packagePercentLoaded"
              color="#544496"
              class="mb-6 _progress-bar"
              height="16"
              rounded  
            />
          </div>
          <v-btn 
            id="CancelLoadingButton" 
            @click="cancelLoad" 
            class="_quaternary mx-auto"
          >
            Go back
          </v-btn>
        </div>
      </v-card>
    </v-dialog>


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
import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import { ProjectOverviewDTO } from "@/api/models";
import AppSections from "@/store/appSections";
import { routeNames } from "@/router/stepper";


@Component({
  components: {
    ATATRadioGroup,
    ATATAlert,
    ContractingShopLearnMore
  }
})
export default class ContractingShop extends Mixins(SaveOnLeave) {
  public isPageLoading = false;
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

  public cancelLoad(): void {
    AcquisitionPackage.setInitialized(false);
    const dest = AcquisitionPackage.getCancelLoadDest;
    AppSections.changeActiveSection(dest);
  }

  public openSlideoutPanel(e: Event): void {
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }

  public get packagePercentLoaded(): number {
    return AcquisitionPackage.getPackagePercentLoaded;
  }

  public get isLoading(): boolean {
    return this.isPageLoading || this.isPackageLoading;
  }

  public get isPackageLoading(): boolean {
    return AcquisitionPackage.getIsLoading;
  }

  private async loadOnEnter(): Promise<void> {
    this.isPageLoading = true;

    const packageId = this.$route.query['packageId'] || "";

    if(packageId){
      await AcquisitionPackage.reset();
      await AcquisitionPackage.setPackageId(packageId as string);
      await AcquisitionPackage.loadPackageFromId(packageId as string);
    }
    // make sure package is initialized
    const storeData = AcquisitionPackage.projectOverview
      || await AcquisitionPackage.loadData<ProjectOverviewDTO>({
        storeProperty: StoreProperties.ProjectOverview,
      });

    this.contractingShop = AcquisitionPackage.contractingShop || "";
    this.isPageLoading = false;
  }
  
  public async skipPage(): Promise<void> {
    if(AcquisitionPackage.acquisitionPackage?.package_status === "WAITING_FOR_TASK_ORDER"){
      this.$router.replace({
        name: routeNames.UnderReview,
        replace: true,
        params: {
          direction: "next"
        },
        query: {
          packageId: AcquisitionPackage.packageId
        }
      }).catch(() => console.log("avoiding redundant navigation"));
    }
  }

  public async mounted(): Promise<void> {
    AcquisitionPackage.setPackagePercentLoaded(0);
    const slideoutPanelContent: SlideoutPanelContent = {
      component: ContractingShopLearnMore,
      title: "Learn More",
    };
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
    await this.loadOnEnter();
    await this.skipPage();
  }

  protected async saveOnLeave(): Promise<boolean> {
    await AcquisitionPackage.setContractingShop(this.contractingShop);
    await AcquisitionPackage.saveAcquisitionPackage();
    return true;
  }
}
</script>
