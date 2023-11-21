<template>
  <v-form ref="form">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <div>
            <h1 class="page-header mb-1 py-0">
              {{ pageHeaderText }}
            </h1>
            <div class="copy-max-width">
              <p v-if="!selectedPackage">
                The following information will be used to refer to this project throughout ATAT and
                will be sent to your CSP during provisioning.<strong>
                Do not include any Controlled Unclassified Information (CUI) or classified
                information.
              </strong>
              </p>
              <p v-else v-html="envSectionHelpText">
              </p>
            </div>

            <!-- if user didn't select an existing aquisition package with status "Waiting
              for taskorder" in previous step, get the portfolio name and associated agency -->
            <div v-if="!selectedPackage" class="copy-max-width">
              <h2>1. Portfolio Details</h2>
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
                :searchFields="['text']"
                :items="agencyData"
                :selectedItem="serviceOrAgency"
                @update:selectedItem="serviceOrAgency = $event"
                :rules="[$validators.required('Please select your service or agency.')]"
                placeholder="Find your service/agency"
                icon="arrow_drop_down"
              />
            </div>

            <div class="h2">2. Tell us about your cloud environments</div>
            <div 
              class="mb-10 copy-max-width" 
              v-html="envSectionHelpText"
            ></div>

            <div class="_radio-grid">
              <v-row class="_grid-header-row">
                <v-col
                  v-for="(header, index) in environmentHeaders"
                  :key="index"
                  class="_grid-header-col"
                  :class="{'': index > 0}"
                  :cols="index === 0 ? 6 : 2"
                >
                  <span class="_header-text">
                    {{ header.label }}
                  </span>
                  <ATATTooltip
                    v-if="header.tooltip"
                    id="PortfolioEnvironmentsTooltip"
                    :tooltipText="header.tooltip"
                    label="PortfolioEnvironments"
                  />
                </v-col>
              </v-row>

              <v-row 
                v-for="(item, index) in envRadioGroups"
                :key="index"
                class="_radio-row"
                :class="[
                  {'_unclassified': isILUnclassified(item)},
                  {'_section-error': showUnclassifiedSelectionError},
                  {'_first-row': index === 0},
                  {'_last-row': index === CSPEnvironmentData.length - 1}
                ]"
              >
                <v-radio-group 
                  v-model="envsInTaskOrder[index].isMigration"
                  @update:modelValue="radioGroupUpdate(index)"
                >
                  <v-col cols="6">
                    <span class="_label">{{ item.label }}</span>
                    <span 
                      class="_description" 
                      v-html="item.description"
                    ></span>
                  </v-col>
                  <v-col cols="2">
                    <v-radio
                      :name="item.id + 'Group'"
                      :value="false"
                      @blur="radioGroupBlurred(index)"
                    ></v-radio>
                  </v-col>
                  <v-col cols="2">
                    <v-radio
                      :name="item.id + 'Group'"
                      :value="true"
                    ></v-radio>
                  </v-col>
                  <v-col cols="2">
                    <v-radio
                      :name="item.id + 'Group'"
                      :value="null"
                      :disabled="isRadioDisabled(item.value)"
                    ></v-radio>
                  </v-col>
                </v-radio-group>

                <div class="_section-error-message" 
                  v-if="isLastUnclassified(item, index)"
                  v-show="showUnclassifiedSelectionError"  
                >
                  Select <strong>New Environment</strong> or <strong>Transfer Billing</strong>
                  for at least one Unclassified environment.
                </div>
              </v-row>

            </div>
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
  PortfolioProvisioningObj, 
  ProvisioningEnv, 
  RadioButton, 
  SaveOnLeaveRefs, 
  SelectData, 
} from "types/Global";
import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";
import { convertAgencyRecordToSelect, convertStringArrayToCommaList } from "@/helpers";
import OrganizationData from "@/store/organizationData";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import _ from "lodash";


@Component({
  components: {
    ATATTextField,
    ATATAutoComplete,
    ATATCheckboxGroup,
    ATATAlert
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
  public serviceOrAgency: SelectData = {text: "", value: ""};
  public envSectionLabel = "";
  public envSectionHelpText = "";

  public classificationLevelsInTaskOrder: string[] = [];
  public classificationLevelsInTaskOrderStr = "";

  public portfolioProvisioningObj: Partial<PortfolioProvisioningObj> = {};
  public envsInTaskOrder: Partial<ProvisioningEnv>[] = [];
  public hasUnclassified = false;
  public envRadioGroups: RadioButton[] = [];

  private agencyData: SelectData[] = [];

  public unclassifiedILDescriptions: Record<string, string> = {
    IL2: "Unclassified environment for workloads <strong>only within IL2</strong>",
    IL4: "Unclassified environment for workloads <strong>up to IL4</strong>",
    IL5: "Unclassified environment for workloads <strong>up to IL5</strong>",
  }
  
  public CSPEnvironmentData = PortfolioStore.CSPEnvironmentData; // all CLs (with U ILs) in T.O.

  public unclassifiedILs = ["IL2", "IL4", "IL5"];
  public isILUnclassified(radio: RadioButton): boolean {
    return this.unclassifiedILs.includes(radio.additionalData as string);
  }

  public isLastUnclassified(radio: RadioButton, index: number): boolean {
    const hasNextEnv = this.CSPEnvironmentData.length > index + 1;
    const lastEnvIsUnclass = index + 1 === this.CSPEnvironmentData.length 
      && this.unclassifiedILs.includes(radio.additionalData as string);
    if (this.hasUnclassified 
      && (lastEnvIsUnclass || (this.unclassifiedILs.includes(radio.additionalData as string) 
      && hasNextEnv && !this.unclassifiedILs.includes(
        this.CSPEnvironmentData[index + 1].highest_information_protection_level)
      ))
    ) {
      return true; 
    }
    return false;
  }

  public get selectedPackage():string {
    return PortfolioStore.selectedAcquisitionPackageSysId
  }

  public get currentData(): Partial<PortfolioProvisioningObj> {
    return {
      portfolioTitle: this.portfolioTitle,
      serviceOrAgency: this.serviceOrAgency.value as string,
      environments: this.envsInTaskOrder,
    }
  }
  public get pageHeaderText():string{
    return this.selectedPackage !== ""
      ? "What impact level(s) do you need to provision?"
      : "Now, let’s gather details about your portfolio."
  }

  public savedData: Partial<PortfolioProvisioningObj> = {
    portfolioTitle: "",
    serviceOrAgency: "",
    environments: [],
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

  public hasUnclassifiedSelection = false;
  public unclassifiedILsBlurredCount = 0;
  public unclassifiedILsBlurred: string[] = [];
  public unclassifiedILsSelected: string[] = [];
  public unclassifiedILsInTaskOrder: string[] = [];
  public unclassifiedErrorOnContinue = false;
  public unclassifiedNotApplicableDisabled = false;

  public get showDescriptions(): boolean {
    return this.unclassifiedILsInTaskOrder.length > 1;
  }

  public radioGroupUpdate(index: number): void {
    const IL = this.CSPEnvironmentData[index].highest_information_protection_level;
    const isUnclass = this.CSPEnvironmentData[index].classification_level === "U";
    const selectionNotNull = this.envsInTaskOrder[index].isMigration !== null;
    debugger;
    if (isUnclass && !this.unclassifiedILsSelected.includes(IL) && selectionNotNull) {
      this.unclassifiedILsSelected.push(IL);
      this.unclassifiedErrorOnContinue = false;
    }
  }

  public radioGroupBlurred(index: number): void {
    const blurredIL = this.CSPEnvironmentData[index].highest_information_protection_level;
    const isUnclass = this.CSPEnvironmentData[index].classification_level === "U";
    if (isUnclass && !this.unclassifiedILsBlurred.includes(blurredIL)) {
      this.unclassifiedILsBlurred.push(blurredIL);
    }
  }

  public get showUnclassifiedSelectionError(): boolean {  
    debugger;  
    return this.unclassifiedErrorOnContinue 
      ||  (this.unclassifiedILsBlurred.length === this.unclassifiedILsInTaskOrder.length
      && this.unclassifiedILsSelected.length === 0);
  }

  

  public getClassificationLevelsInTOString(): string {
    const str = convertStringArrayToCommaList(this.classificationLevelsInTaskOrder, "and", true);
    return this.classificationLevelsInTaskOrder.length > 1 ? str + " levels" : str + " level";
  }
  
  public async setTaskOrderData(): Promise<void> {
    this.portfolioProvisioningObj = _.cloneDeep(PortfolioStore.portfolioProvisioningObj);
    if (this.portfolioProvisioningObj) {
      this.portfolioTitle = this.portfolioProvisioningObj.portfolioTitle as string;
      const selectedServiceOrAgency 
        = this.agencyData.find(obj => obj.value === this.portfolioProvisioningObj.serviceOrAgency);
      if (selectedServiceOrAgency) {
        this.serviceOrAgency = selectedServiceOrAgency;
      }
      
      this.savedData = {
        portfolioTitle:  this.portfolioTitle,
        serviceOrAgency: this.serviceOrAgency.value,
        environments: this.portfolioProvisioningObj.environments,
      }
 
      this.classificationLevelsInTaskOrderStr = this.getClassificationLevelsInTOString();
      this.classificationLevelsInTaskOrder = 
        this.portfolioProvisioningObj.classificationLevels as string[];

      this.envSectionHelpText = `Based on your task order details, you have
      funding for ${ this.classificationLevelsInTaskOrderStr }. For each option below, 
      select whether you need to provision a new environment or
      transfer billing for an existing cloud environment to your JWCC task order.`
      this.envSectionLabel = this.selectedPackage ? "": `2. Tell us about your cloud environments`

      if (!this.portfolioProvisioningObj.environments) {
        this.envsInTaskOrder = await this.buildEnvsInTaskOrder();
      } else {
        this.envsInTaskOrder = this.portfolioProvisioningObj.environments;
      }
      this.envsInTaskOrder = this.envsInTaskOrder.sort(
        (a,b) => { return a.cspName && b.cspName  ? a.cspName > b.cspName ? 1 : -1 : 0; }
      )
      await this.buildEnvironmentRadioGropus();
    }
  }

  public async buildEnvsInTaskOrder(): Promise<Partial<ProvisioningEnv>[]> {
    const envs: Partial<ProvisioningEnv>[] = [];
    this.CSPEnvironmentData.forEach(c => {
      const env: Partial<ProvisioningEnv> = {
        cspName: c.name,
        isMigration: undefined,
        il: c.highest_information_protection_level,
      }
      envs?.push(env);
    });
    return envs;
  }
  
  public async buildEnvironmentRadioGropus(): Promise<void> {
    const unclassCount = 
      this.CSPEnvironmentData.filter(obj => obj.classification_level === "U").length;
    this.unclassifiedNotApplicableDisabled = unclassCount === 1;

    const classificationLevelAbbrs: Record<string, string> = {
      "Unclassified": "U",
      "Secret": "S",
      "Top Secret": "TS"
    }

    this.classificationLevelsInTaskOrder.forEach((cl: string) => {
      const clAbbr = classificationLevelAbbrs[cl];

      const envs = this.CSPEnvironmentData.filter(obj => obj.classification_level === clAbbr);
      envs.forEach(env => {
        let label = "";
        let description = undefined;
  
        if (env.classification_level === "U") {
          this.hasUnclassified = true;
          this.unclassifiedILsInTaskOrder.push(env.highest_information_protection_level);
          label = env.cloud_distinguisher?.display_name && unclassCount > 1
            ? env.cloud_distinguisher?.display_name
            : "Unclassified";
          description = unclassCount > 1
            ? this.unclassifiedILDescriptions[env.highest_information_protection_level]
            : "";
        } else {
          label = env.classification_level === "S" ? "Secret" : "Top Secret";
        }
        const radioData = { 
          id: env.name,
          label,
          description,
          value: env.classification_level as string,
          additionalData: env.highest_information_protection_level,
        };

        this.envRadioGroups.push(radioData)
        
      })

    })

  }
  public isRadioDisabled(classificationLevel: string): boolean {
    return classificationLevel === "S" || classificationLevel === "TS"
      || this.unclassifiedNotApplicableDisabled;
  }


  public async loadOnEnter(): Promise<void> {
    if (!OrganizationData.agency_data || OrganizationData.agency_data.length === 0) {
      await OrganizationData.getAgencyData();
    }
    this.agencyData = convertAgencyRecordToSelect(OrganizationData.agency_data); 
    await this.setTaskOrderData();
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async saveOnLeave(): Promise<boolean> {
    try {
      this.unclassifiedErrorOnContinue = 
        this.hasUnclassified && this.unclassifiedILsSelected.length === 0;;
      if (this.unclassifiedErrorOnContinue) return false;
      await PortfolioStore.setPortfolioProvisioning(this.currentData);
    } catch (error) {
      console.error(error);
    }
    return true;
  }

}
export default toNative(PortfolioDetails)
</script>
