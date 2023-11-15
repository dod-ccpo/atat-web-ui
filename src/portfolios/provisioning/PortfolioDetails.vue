<template>
  <v-form ref="form">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header mb-1 py-0">
            {{pageHeaderText}}
          </h1>
          <div class="copy-max-width">
            <p v-if="!selectedPackage">
              The following information will be used to refer to this project throughout ATAT and
              will be sent to your CSP during provisioning.<strong>
              Do not include any Controlled Unclassified Information (CUI) or classified
              information.
            </strong>
            </p>
            <p v-else>
              Select all that apply
            </p>
          </div>
          <div v-if="!selectedPackage" class="copy-max-width">
          <div class="h2 mb-6">1. Portfolio Details</div>
          <ATATTextField 
            ref="PortfolioTitleRef"
            label="Portfolio title"
            class="_input-max-width mb-10"
            :value="portfolioTitle"
            @update:value="portfolioTitle = $event"
            :rules="[
              $validators.required('Please enter your project title.'),
              $validators.maxLength(60, 'Title cannot exceed 60 characters')
            ]"
          />

          <ATATAutoComplete
            ref="AgencyRef"
            id="Agency"
            class="_input-max-width mb-10"
            label="What service or agency is this portfolio affiliated with?"
            :label-sr-only="false"
            titleKey="text"
            :searchFields="['text']"
            :items="agencyData"
            :selectedItem="serviceOrAgency"
            @update:selectedItem="serviceOrAgency = $event"
            :rules="[$validators.required('Please select your service or agency.')]"
            placeholder="Find your service/agency"
            icon="arrow_drop_down"
          />
          </div>
          <!-- <ATATCheckboxGroup
            v-if="showCheckbox"
            ref="PortfolioCheckboxRef"
            :groupLabel="checkboxLabel"
            :groupLabelHelpText="checkboxHelpText"
            id="ImpactLevelCheckboxes"
            :value="selectedILs"
            @update:value="selectedILs = $event"
            :items="checkboxItems"
            :descriptionNormal="true"
            name="checkbox-card"
            :card="true"
            cardWidth="800"
            :rules="checkboxRules"
            :validateOnLoad="false"
            :largeLabel="true"
          /> -->
          <div 
          v-if="showCheckbox"
          >
            <div class="h2">2. Tell us about your cloud environments</div>
            <div class="text-base font-size-14 mb-10 copy-max-width">
              Based on your task order details, you have funding for 
              (<strong>Unclassified</strong>,
              <strong>Secret</strong>, and 
              <strong>Top Secret</strong>) 
              levels. For each option below, select whether you need to provision
              a new environment or transfer billing for an existing cloud environment
              to your JWCC task order.
            </div>
            <v-table
            class="_environments-table"
            >
              <thead>
                <th 
                v-for="header in environmentHeaders"
                :key="header.label"
                >
                  <div class="d-flex align-center justify-center">
                    <span :class="[{'mr-2': header.tooltip}]">{{ header.label }}</span>
                    <ATATTooltip
                      v-if="header.tooltip"
                      id="PortfolioEnvironmentsTooltip"
                      :tooltipText="header.tooltip"
                      label="PortfolioEnvironments"
                    />
                  </div>
              </th>
              </thead>
              <tbody>
                <tr
                v-for="item in checkboxItems"
                :key="item.id"
                >
                <td>
                  <div class="d-flex flex-column _environment-info">
                    <span class="_environment-label">{{ item.label }}</span>
                    <span class="_environment-description">{{ item.description }}</span>
                  </div>
                </td>
                <td>
                  <v-radio
                  class="d-flex justify-center"
                  @click="onRadioClick(false, item.id)"
                  :model-value="optionalEnvs[item.id].isMigration === false"
                  >
                  </v-radio>
                </td>
                <td>
                  <v-radio
                  class="d-flex justify-center"
                  @click="onRadioClick(true, item.id)"
                  :model-value="optionalEnvs[item.id].isMigration === true"
                  ></v-radio>
                </td>
                <td>
                  <v-radio
                  class="d-flex justify-center"
                  @click="onRadioClick(null, item.id)"
                  :model-value="optionalEnvs[item.id].isMigration === null"
                  ></v-radio>
                </td>
                </tr>
             
                <tr
                v-for="item in classificationLevels"
                :key="item"
                >
                <td>
                  <div class="d-flex flex-column _environment-info">
                    <span class="_environment-label">{{ item }}</span>
                  </div>
                </td>
                <td>
                  <v-radio
                  class="d-flex justify-center"
                  >
                  </v-radio>
                </td>
                <td>
                  <v-radio
                  class="d-flex justify-center"
                  ></v-radio>
                </td>
                <td>
                  <v-radio
                  :disabled="true"
                  class="d-flex justify-center"
                  ></v-radio>
                </td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component,  Hook,  Vue, toNative } from "vue-facing-decorator";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import PortfolioStore from "@/store/portfolio";
import { 
  Checkbox, 
  PortfolioProvisioning, 
  SaveOnLeaveRefs, 
  SelectData, 
  SelectedPortfolioEnv 
} from "types/Global";
import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";
import { convertAgencyRecordToSelect } from "@/helpers";
import OrganizationData from "@/store/organizationData";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";


@Component({
  components: {
    ATATTextField,
    ATATAutoComplete,
    ATATCheckboxGroup,
  }
})

class PortfolioDetails extends Vue {

  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs,
      nextTick: this.$nextTick,
    }).catch()
  }


  public portfolioTitle = "";
  public serviceOrAgency: SelectData = { text: "", value: "" };
  public selectedCSPProvider = "";
  public checkboxLabel = ""
  public checkboxHelpText = ""
  public classificationLevels:string[] = []
  private agencyData: SelectData[] = [];
  private selectedILs: SelectedPortfolioEnv[] = [];
  private optionalEnvs: Record<string, Record<string ,boolean | null | undefined>> = {}
  
  public CSPProvisioningData = PortfolioStore.CSPProvisioningData;

  private checkboxItems: Checkbox[] = [];
  private checkboxRulesOn = false;
  public get checkboxRules(): unknown[] {
    return this.checkboxRulesOn
      ? [this.$validators.required('Select at least one impact level')]
      : []
  }

  public async buildILCheckboxItems(): Promise<void> {
    this.CSPProvisioningData.forEach(obj => {
      if (obj.classification_level === "U" && obj.cloud_distinguisher) {
        const checkboxItem: Checkbox = {
          id: obj.cloud_distinguisher.name as string,
          label: obj.cloud_distinguisher.name + " – " + obj.cloud_distinguisher.display_name,
          value: obj.name,
          description: obj.cloud_distinguisher.description,
        }
        this.checkboxItems.push(checkboxItem);
        this.optionalEnvs[checkboxItem.id] = {isMigration: undefined}
      }
    });
    this.checkboxRulesOn = true;
  }

  public get selectedPackage():string {
    return PortfolioStore.selectedAcquisitionPackageSysId
  }

  public get showCheckbox():boolean {
    return PortfolioStore.doesCSPHaveImpactLevels 
      && PortfolioStore.doesTaskOrderHaveUnclassified 
      && this.checkboxItems.length > 0;
  }
  public get currentData(): PortfolioProvisioning {
    return {
      portfolioTitle: this.portfolioTitle,
      serviceOrAgency: this.serviceOrAgency.value,
      selectedILs: this.selectedILs,
    }
  }
  public get pageHeaderText():string{
    return this.selectedPackage !== ""
      ? "What impact level(s) do you need to provision?"
      : "Now, let’s gather details about your portfolio."
  }

  public savedData: PortfolioProvisioning = {
    portfolioTitle: "",
    serviceOrAgency: "",
    selectedILs: [],
  }

  public environmentHeaders = [
    {label: "Available Cloud Environments"},
    {label: "New Environment", 
      tooltip: `Select this option if you need to stand up
      a new cloud workload or migrate an existing on-premise environment to the cloud.
      During the provisioning process, a new environment will be created within each level
      selected below.`
    },
    {label: "Transfer Billing", 
      tooltip: `Select this option if you have
      existing workloads within the cloud environment and need to update billing
      information to your JWCC task order. ATAT will NOT create a new cloud environment
      during the provisioning process.`
    },
    {label: "Not applicable"},
  ]
  
  public onRadioClick(val: any, id: any): void{
    this.optionalEnvs[id].isMigration = val
  }
  public async setTaskOrderData(): Promise<void> {
    const storeData = PortfolioStore.portfolioProvisioningObj;
    if (storeData) {
      this.portfolioTitle = storeData.portfolioTitle as string;
      const selectedServiceOrAgency 
        = this.agencyData.find(obj => obj.value === storeData.serviceOrAgency);
      if (selectedServiceOrAgency) {
        this.serviceOrAgency = selectedServiceOrAgency;
      }
      this.savedData = {
        portfolioTitle:  this.portfolioTitle,
        serviceOrAgency: this.serviceOrAgency.value,
        selectedILs: this.selectedILs,
      }
      this.selectedCSPProvider = storeData.csp ?? ""
      this.checkboxHelpText = this.selectedPackage? "": `Based on your task order details, you have
      funding for (Unclassified, Secret and Top Secret)
      levels. For each option below, select whether you need to provision a new environment or
      transfer billing for an existing cloud environment to your JWCC task order.`
      this.checkboxLabel = this.selectedPackage? "": `2. Tell us about your cloud environments`

      this.selectedILs = storeData.selectedILs ?? [];
    }
  }

  public async loadOnEnter(): Promise<void> {
    const unclassCSPs = this.CSPProvisioningData.filter((csp) => csp.classification_level === 'U')
    if (!OrganizationData.agency_data || OrganizationData.agency_data.length === 0) {
      await OrganizationData.getAgencyData();
    }
    this.agencyData = convertAgencyRecordToSelect(OrganizationData.agency_data); 
    this.classificationLevels = PortfolioStore.portfolioProvisioningObj?.classificationLevels
      ?.filter((level: string) => level.toLowerCase() !== 'unclassified') ?? [];
    
    await this.setTaskOrderData();
    if (PortfolioStore.CSPHasImpactLevels && unclassCSPs.length > 1) {
      await this.buildILCheckboxItems();
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async saveOnLeave(): Promise<boolean> {
    try {
      
      this.checkboxItems.forEach((item: Checkbox) =>{
        if(this.optionalEnvs[item.id].isMigration !== undefined){
          return this.selectedILs.push(
            /* eslint-disable camelcase */
            { value: item.value, is_migration: this.optionalEnvs[item.id].isMigration }
          )
        }
      })
      // ensure correct order e.g., IL2, IL4, IL5
      this.selectedILs.sort((a, b) => a.value.localeCompare(b.value)); 
      console.log(this.selectedILs)
      await PortfolioStore.setPortfolioProvisioning(this.currentData);
    } catch (error) {
      console.error(error);
    }
    return true;
  }

}
export default toNative(PortfolioDetails)
</script>
