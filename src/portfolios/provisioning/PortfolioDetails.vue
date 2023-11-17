<template>
  <v-form ref="form">
    <v-container fluid class="container-max-width">
      <v-row>
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

            <div class="h2">2. Tell us about your cloud environments</div>
            <div class="text-base font-size-14 mb-10 copy-max-width" v-html="envSectionHelpText">
            </div>
            <v-table
            class="_environments-table">
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
              <tbody
              :class="[
              {'_validation-error': noUnclassifiedILsSelected}
              ]"
              >
                <tr
                v-for="(item, index) in envRadioGroups"
                :key="index"
                >
                <td>
                  <div class="d-flex flex-column _environment-info">
                    <span class="_environment-label">{{ item.label }}</span>
                    <span class="_environment-description">{{ item.description }}</span>
                  </div>
                </td>
                <td>
                  <v-radio
                    :name="item.groupName"
                    class="d-flex justify-center _radio-button"
                    @click="onRadioClick(false, item.id)"
                    :model-value="envRadioGroups[item.id].isMigration === false"
                  >
                  </v-radio>
                </td>
                <td>
                  <v-radio
                  class="d-flex justify-center _radio-button"
                  @click="onRadioClick(true, item.id)"
                  :model-value="availableUnclassEnvs[item.id].isMigration === true"
                  ></v-radio>
                </td>
                <td>
                  <v-radio
                  class="d-flex justify-center _radio-button"
                  @click="onRadioClick(null, item.id)"
                  :model-value="availableUnclassEnvs[item.id].isMigration === null"
                  ></v-radio>
                </td>
                </tr>
                <tr v-if="noUnclassifiedILsSelected">
                  <td colspan="4">
                    <ATATAlert
                    id="SelectAnEnvironment"
                    type="error"
                    >
                    <template v-slot:content>
                      <span class="_error-message">
                        Select <span class="emphasis">New Environment</span> 
                        or <span class="emphasis">Transfer Billing</span> for
                        at least one Unclassified environment.
                      </span>
                    </template>
                    </ATATAlert>
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
  public serviceOrAgency: SelectData = {};
  // public selectedCSPProvider = "";
  public envSectionLabel = "";
  public envSectionHelpText = "";

  public classificationLevelsInTaskOrder: string[] = [];
  public classificationLevelsInTaskOrderStr = "";

  public portfolioProvisioningObj: Partial<PortfolioProvisioningObj> = {};
  public envsInTaskOrder: Partial<ProvisioningEnv>[] = [];
  
  public envRadioGroups: Record<string, RadioButton>[] = [];
  public hasUnclassILs = false;

  private agencyData: SelectData[] = [];
  // private selectedEnvs: SelectedProvisioningEnv[] = [];
  // private availableUnclassEnvs: Record<string, Record<string ,boolean | null | undefined>> = {}
  private noUnclassifiedILsSelected = false;
  
  public CSPProvisioningData = PortfolioStore.CSPProvisioningData; // all CLs (with U ILs) in T.O.

  // private checkboxItems: Checkbox[] = [];
  // private checkboxRulesOn = false;
  // public get checkboxRules(): unknown[] {
  //   return this.checkboxRulesOn
  //     ? [this.$validators.required('Select at least one impact level')]
  //     : []
  // }

  // public async buildILCheckboxItems(): Promise<void> {
  //   this.CSPProvisioningData.forEach(obj => {
  //     if (obj.classification_level === "U" && obj.cloud_distinguisher) {
  //       const checkboxItem: Checkbox = {
  //         id: obj.cloud_distinguisher.name as string,
  //         label: obj.cloud_distinguisher.name + " – " + obj.cloud_distinguisher.display_name,
  //         value: obj.name,
  //         description: obj.cloud_distinguisher.description,
  //       }
  //       this.checkboxItems.push(checkboxItem);
  //       this.availableUnclassEnvs[checkboxItem.id] = {isMigration: undefined}
  //     }
  //   });
  //   this.checkboxRulesOn = true;
  // }

  public get selectedPackage():string {
    return PortfolioStore.selectedAcquisitionPackageSysId
  }

  // public get showCheckbox():boolean {
  //   return PortfolioStore.doesCSPHaveImpactLevels 
  //     && PortfolioStore.doesTaskOrderHaveUnclassified 
  //     && this.checkboxItems.length > 0;
  // }

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
  
  public onRadioClick(val: any, id: any): void{
    // EJY come back to this!!!!
    // this.availableUnclassEnvs[id].isMigration = val
  }

  public getClassificationLevelsInTOString(): string {
    return convertStringArrayToCommaList(this.classificationLevelsInTaskOrder, "and", true);

  }
  
  public async setTaskOrderData(): Promise<void> {
    const storeData = _.cloneDeep(PortfolioStore.portfolioProvisioningObj);
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
        environments: storeData.environments,
      }

      // this.selectedCSPProvider = storeData.csp ?? ""

      this.classificationLevelsInTaskOrder = storeData.classificationLevels as string[];
      
      this.envSectionHelpText = `Based on your task order details, you have
      funding for ${ this.classificationLevelsInTaskOrderStr }
      levels. For each option below, select whether you need to provision a new environment or
      transfer billing for an existing cloud environment to your JWCC task order.`
      this.envSectionLabel = this.selectedPackage ? "": `2. Tell us about your cloud environments`

      if (!storeData.environments) {
        this.envsInTaskOrder = await this.buildEnvsInTaskOrder();
      } else {
        this.envsInTaskOrder = storeData.environments;
      }
      this.envsInTaskOrder = this.envsInTaskOrder.sort(
        (a,b) => { return a.cspName && b.cspName  ? a.cspName > b.cspName ? 1 : -1 : 0; }
      )
      await this.buildEnvironmentRadioGropus();
    }
  }

  public async buildEnvsInTaskOrder(): Promise<Partial<ProvisioningEnv>[]> {
    const envs: Partial<ProvisioningEnv>[] = [];
    this.CSPProvisioningData.forEach(c => {
      const env: Partial<ProvisioningEnv> = {
        cspName: c.name,
        isMigration: undefined,
      }
      envs?.push(env);
    });
    return envs;
  }
  
  public async buildEnvironmentRadioGropus(): Promise<void> {

    this.CSPProvisioningData.forEach(env => {
      let label = "";
      let description = undefined;
      if (env.classification_level === "U") {
        label = this.hasUnclassILs
          ? env.cloud_distinguisher?.name + ": " + env.cloud_distinguisher?.display_name
          : "Unclassified";
        description = env.cloud_distinguisher?.description;
      } else {
        label = env.classification_level === "S" ? "Secret" : "Top Secret";
      }
      const radioData = { 
        isMigration: undefined,
        label,
        description,
        id: env.name,
        value: "foo",
      };
      const radioGroup = {
        [env.name]: radioData
      }
      this.envRadioGroups.push(radioGroup)
    })
  }


  public async loadOnEnter(): Promise<void> {
    debugger;
    if (!OrganizationData.agency_data || OrganizationData.agency_data.length === 0) {
      await OrganizationData.getAgencyData();
    }
    this.agencyData = convertAgencyRecordToSelect(OrganizationData.agency_data); 
    this.hasUnclassILs = this.CSPProvisioningData.filter(
      obj => obj.classification_level === "U"
    ).length > 1;

    // const unclassEnvs 
    //    = this.CSPProvisioningData.filter((csp) => csp.classification_level === 'U')
    
    await this.setTaskOrderData();
    // if (PortfolioStore.CSPHasImpactLevels && unclassEnvs.length > 1) {
    //   await this.buildILCheckboxItems();
    // }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async saveOnLeave(): Promise<boolean> {
    try {
      for(const env in this.availableUnclassEnvs){
        if(this.availableUnclassEnvs[env].isMigration === undefined){
          this.noUnclassifiedILsSelected = true;
          return false;
        }
      }
      this.checkboxItems.forEach((item: Checkbox) =>{
        if(this.availableUnclassEnvs[item.id].isMigration !== undefined){
          return this.selectedEnvs.push(
            /* eslint-disable camelcase */
            { value: item.value, isMigration: this.availableUnclassEnvs[item.id].isMigration }
          )
        }
      })
      // ensure correct order e.g., IL2, IL4, IL5
      this.selectedEnvs.sort((a, b) => a.value.localeCompare(b.value)); 
      console.log(this.selectedEnvs)
      await PortfolioStore.setPortfolioProvisioning(this.currentData);
    } catch (error) {
      console.error(error);
    }
    return true;
  }

}
export default toNative(PortfolioDetails)
</script>
