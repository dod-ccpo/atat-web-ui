<template>
  <v-form ref="form" class="mb-7" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header mb-3">
            Current Environment Summary
          </h1>
          <p id="IntroP">
            If you have more instances for this environment, add them below. You 
            can also edit or delete any information from the instances that you 
            have already entered. When you’re done, click the “Continue” button to 
            wrap up this section.
          </p>


          <div 
            class="mt-4 _light-gray-card"
            v-if="environmentTypeText && classificationsText && tableData.length > 0"
          >
            <div class="d-flex" id="EnvironmentSummaryBox">
              <div>
                <span id="EnvironmentType" class="font-weight-500">{{ environmentTypeText }}</span>
                <br />
                <span id="ClassificationText"> {{ classificationsText }}</span>
              </div>
              <div class="ml-6">
                <button
                  type="button"
                  id="EditEnvironment"
                  @click="editEnvironment()"
                  @keydown:enter="editEnvironment()"
                  @keydown:space="editEnvironment()"
                  aria-label="Edit Current Environment"
                >
                  <ATATSVGIcon name="edit" height="19" width="19" />
                </button>
              </div>
            </div>
          </div>

          <div 
            v-if="tableData.length === 0"
            class="w-100 py-10 border1 _border-rounded border-base-lighter text-center mb-10 mt-10" 
          >
            You currently do not have any instances.
          </div>

          <v-table
            v-if="tableData.length"
            :headers="tableHeaders"
            :items="tableData"
            :items-per-page="-1"
            class="elevation-0 _instances-table mt-10"
            :hide-default-footer="true"
            no-data-text="You currently do not have any instances."
          >
            <thead>
              <tr>
                <th
                  v-for="header in tableHeaders"
                  :key="(header.value as string)"
                  :id="(header.value as string)"
                  class="text-start"
                >
                  {{ header.title }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in tableData"
                :key="item.instanceNumber"
              >
                <td>
                  {{ item.instanceNumber }}
                </td>
                <td v-if="envLocation !== 'ON_PREM'">
                  <span
                    v-html="item.location"
                    :class="[{'text-error font-weight-500': !item.isValid }]">
                  </span>
                  <div v-if="!item.isValid" class="d-flex align-center nowrap">
                    <ATATSVGIcon 
                      name="errorFilled"
                      width="13"
                      height="13"
                      color="error"
                    />
                    <span class="font-size-12 text-error d-inline-block ml-1">Missing info</span>
                  </div>
                </td>
                <td v-if="hasMultipleClassifications">
                  <span class="nowrap">{{ item.classification }}</span>
                </td>
                <td>
                  <span class="nowrap">{{ item.qty }}</span>
                </td>
                <td>
                  <span class="nowrap">{{ item.vCPU }}</span>
                </td>
                <td>
                  <span class="nowrap">{{ item.memory }}</span>
                </td>
                <td>
                  <span class="nowrap">{{ item.storage }}</span>
                </td>
                <td>
                  <span class="nowrap">{{ item.performance }}</span>
                </td>
                <td>
                  <button
                    type="button"
                    :id="'EditButton_' + item.instanceNumber"
                    @click="editInstance(item)"
                    class="mr-2"
                  >
                    <ATATSVGIcon name="edit" height="19" width="19" />
                  </button>

                  <button
                    type="button"
                    :id="'DeleteButton_' + item.instanceNumber"
                    @click="confirmDeleteInstance(item)"
                    class="ml-2"
                  >
                    <ATATSVGIcon name="remove" height="18" width="14" />
                  </button>
                </td>
              </tr>
            </tbody>
          </v-table> 

          <hr class="mt-0" v-if="tableData.length" /> 

          <v-btn
            id="AddInstance"
            type="button"
            role="link" 
            class="_secondary _normal _small-text mt-5"
            :ripple="false"
            @click="addInstance()"
          >
            <ATATSVGIcon 
              color="primary" 
              height="17" 
              width="18" 
              name="control-point" 
              class="mr-2"
            />
            Add 
            <span v-if="tableData.length">&nbsp;another&nbsp;</span> 
            instance
          </v-btn>  

        </v-col>
      </v-row>
    </v-container>

    <ATATDialog
      id="DeleteInstanceModal"
      :showDialog="showDeleteInstanceDialog"
      :title="deleteInstanceModalTitle"
      no-click-animation
      okText="Delete instance"
      width="450"
      @ok="deleteInstance"
      @cancelClicked="showDeleteInstanceDialog = false"
    >
      <template #content>
        <p class="body">
          This instance will be removed from your environment summary. Any details
          about this instance will not be saved.
        </p>
      </template>
    </ATATDialog>

  </v-form>
</template>
<script lang="ts">
/*eslint vue/no-child-content: 1 */
import { Component, Watch, Vue, toNative } from "vue-facing-decorator";

import ATATDialog from "@/components/ATATDialog.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { ClassificationLevelDTO, CurrentEnvironmentInstanceDTO } from "@/api/models";
import { DataTableHeader, EnvInstanceSummaryTableData } from "types/Global";
import CurrentEnvironment, 
{ defaultCurrentEnvironment } from "@/store/acquisitionPackage/currentEnvironment";
import _ from "lodash";
import { routeNames } from "@/router/stepper";
import { buildClassificationLabel, toTitleCase } from "@/helpers";
import classificationRequirements from "@/store/classificationRequirements";
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({
  components: {
    ATATDialog,
    ATATSVGIcon
  }  
})
class EnvironmentSummary extends Vue {
  public currEnvData = defaultCurrentEnvironment;
  public deleteInstanceModalTitle = "";
  public envInstances: CurrentEnvironmentInstanceDTO[] = [];
  public envLocation = "";
  public classificationsCloud: string[] = [];
  public classificationsOnPrem: string[] = [];
  public tableHeaders: DataTableHeader[] = [];
  public tableData: EnvInstanceSummaryTableData[] = [];
  public showDeleteInstanceDialog = false;
  public instanceNumberToDelete = 0;
  public classificationLevels: ClassificationLevelDTO[] = [];
  public locationNames: Record<string, string> ={}
  public hasMultipleClassifications = false

  public get environmentTypeText(): string {
    switch (this.envLocation) {
    case "CLOUD": return "Cloud Environment";
    case "ON_PREM": return "On-premise Environment";
    case "HYBRID": return "Hybrid Environment";
    default: return "";
    }
  }

  public topLevelClassification(abbr: string): string {
    switch(abbr) {
    case "U": return "Unclassified";
    case "S": return "Secret";
    case "TS": return "TS";
    default: return ""
    }
  }

  public get classificationsText(): string {
    const classifications: string[] = [];
    const unclassifiedILs: string[] = [];
    const locationClassifications = this.classificationsCloud.concat(this.classificationsOnPrem);

    locationClassifications.forEach((sysId) => {
      const cl = this.classificationLevels.find(obj => obj.sys_id === sysId);
      classifications.push(this.topLevelClassification(cl?.classification as string))
      if (cl?.classification === "U") {
        unclassifiedILs.push(cl.impact_level);
      }
    });
    const uniqueClassifications = (classifications.filter((v, i, a) => a.indexOf(v) === i));
    if (this.envLocation !== "ON_PREM" && uniqueClassifications.includes("Unclassified")) {
      const uniqueILs = (unclassifiedILs.filter((v, i, a) => a.indexOf(v) === i)).join(", ");
      const unclassifiedIndex = uniqueClassifications.indexOf("Unclassified");
      uniqueClassifications.splice(unclassifiedIndex, 1);
      uniqueClassifications.unshift("Unclassified (" + uniqueILs + ")");
    }
    let classificationsStr = uniqueClassifications.join(", ");
    classificationsStr = classificationsStr.replace(/,(?=[^,]+$)/, ' and');
    return "Deployed within " + classificationsStr;
  }

  public editEnvironment(): void {
    this.$nextTick(() => {
      this.$router.push({
        name: routeNames.CurrentEnvironmentLocation,
        query: {
          direction: "next"
        }   
      });

    })
  }

  public async addInstance(): Promise<void> {
    await CurrentEnvironment.setCurrentEnvInstanceNumber(this.envInstances.length);
    this.navigate();
  }

  public navigate(): void {
    // navigate to instance form
    this.$router.push({
      name: routeNames.InstanceDetails,
      query: {
        direction: "next"
      }   
    });
  }

  public async editInstance(instance: EnvInstanceSummaryTableData): Promise<void> {
    await CurrentEnvironment.setCurrentEnvironmentInstanceNumber(instance.instanceSysId as string);
    this.navigate();
  }


  public instanceToDeleteSysId = "";

  public confirmDeleteInstance(item: EnvInstanceSummaryTableData): void {
    this.instanceNumberToDelete = item.instanceNumber;
    this.deleteInstanceModalTitle = "Delete instance #" + this.instanceNumberToDelete + "?";
    this.showDeleteInstanceDialog = true;
    this.instanceToDeleteSysId = item.instanceSysId as string;
  }

  public async deleteInstance(): Promise<void> {
    await CurrentEnvironment.deleteEnvironmentInstance(this.instanceToDeleteSysId);
    this.$nextTick(async () => {
      await this.buildTableData();
      this.showDeleteInstanceDialog = false;
      this.instanceToDeleteSysId = "";
      this.resetInstanceNumbers();
    })
  }

  /**
   * when an item is deleted, both the instance_number and instance_name need to be reset
   * InstanceNumbers to accurately reflect the new dataset after deletion.
   * 
   * For instance, if instance 2 was deleted from instances [1,2,3] then the new dataset is [1,2] &
   * the database data should reflect that.
   */
  private resetInstanceNumbers(): void {
    this.envInstances.forEach(async (instance)=>{
      // eslint-disable-next-line camelcase
      instance.instance_number = this.tableData.find(
        id => id.instanceSysId === instance.sys_id
      )?.instanceNumber || 0;
      // eslint-disable-next-line camelcase
      instance.instance_name = "Instance #" + instance.instance_number;
      await CurrentEnvironment.saveCurrentEnvironmentInstance(instance);
    });
  }


  public async validateInstance(
    instance: CurrentEnvironmentInstanceDTO,
  ): Promise<boolean> {
    const instanceData: Record<string, any> = _.clone(instance);
    let isValid = true;
    let requiredFields: string[] = [];
    requiredFields = [
      "instance_location",
      "classification_level",
      "current_usage_description",
      "users_per_region",
      "operating_system",
      "licensing",
      "number_of_vcpus",
      "processor_speed",
      "memory_amount",
      "storage_type",
      "storage_amount",
      "performance_tier",
      "number_of_instances",
      "data_egress_monthly_amount",
    ];
    requiredFields.forEach((field) => {
      if (instanceData[field] === "") {
        isValid = false;
      }
    });
    // extra logic needed if current_usage_description === "IRREGULAR_USAGE"
    if (instanceData.current_usage_description === "IRREGULAR_USAGE") {
      const isEventBased = instanceData.is_traffic_spike_event_based === "YES";
      const isPeriodBased = instanceData.is_traffic_spike_period_based === "YES";
      if (!isEventBased && !isPeriodBased) {
        // one of these is required if irregular usage
        isValid = false;
      }
      if ((isEventBased && instanceData.traffic_spike_event_description === "")
        || (isPeriodBased && instanceData.traffic_spike_period_description === "")
      ) {
        // description is required if the according checkbox is checked
        isValid = false;
      }
    }

    if (instanceData.pricing_model === "PREPAID"
      && instanceData.pricing_model_expiration === ""
    ) {
      isValid = false;
    }
    
    return isValid;
  }

  public currEnvInstances: CurrentEnvironmentInstanceDTO[] = 
    CurrentEnvironment.currEnvInstances;
  
  @Watch("currEnvInstances")
  public async currEnvInstancesUpdated(): Promise<void> {
    await this.buildTableData();
  }

  public async buildTableData(): Promise<void> {
    setTimeout(async () => {

      this.hasMultipleClassifications = 
        (this.classificationsCloud.length + this.classificationsOnPrem.length) > 1;

      if (this.hasMultipleClassifications) {
        this.tableHeaders = [    
          { title: "", value: "instanceNumber", width: "50" },
          { title: "Location", value: "location" },
          { title: "Classification", value: "classification" },
          { title: "Quantity", value: "qty" },
          { title: "vCPU", value: "vCPU" },
          { title: "Memory", value: "memory" },
          { title: "Storage", value: "storage" },
          { title: "Performance", value: "performance" },
          { title: "", value: "actions", width: "75" },
        ]
      } else {
        this.tableHeaders = [    
          { title: "", value: "instanceNumber", width: "50" },
          { title: "Location", value: "location" },
          { title: "Quantity", value: "qty" },
          { title: "vCPU", value: "vCPU" },
          { title: "Memory", value: "memory" },
          { title: "Storage", value: "storage" },
          { title: "Performance", value: "performance" },
          { title: "", value: "actions", width: "75" },
        ]
      }

      this.tableData = [];
      this.envInstances = await CurrentEnvironment.getCurrentEnvironmentInstances();
      if (this.envInstances?.length){

        if (this.envLocation === "ON_PREM") {
          this.tableHeaders = this.tableHeaders.filter(obj => obj.value !== "location");
        }

        let instanceIndex = 0;
        for (const instance of this.envInstances) {
          const selectedInCloud = this.classificationsCloud.includes(instance.classification_level)
          const selectedOnPrem = this.classificationsOnPrem.includes(instance.classification_level)
          if(!selectedInCloud && !selectedOnPrem) {
            // eslint-disable-next-line camelcase
            instance.classification_level = ""
          }
          const isValid = await this.validateInstance(instance);
          let storage = "";
          if (instance.storage_type && instance.storage_amount && instance.storage_unit) {
            const storageType = toTitleCase(instance.storage_type);
            storage = storageType + ": " + String(instance.storage_amount)
              + " " + instance.storage_unit;
          }
          let performance = "";
          if (instance.performance_tier) {
            performance = toTitleCase(instance.performance_tier);
            performance += performance === "General" ? " Purpose" : " Optimized";
          }
          let location = "";
          if (instance.instance_location === "ON_PREM") {
            location = "On-premise";
          } else {
            const instances: string[] = []
            if (typeof instance.deployed_regions === "string") {
              const regionsSysIds = instance.deployed_regions?.split(',')
              regionsSysIds.forEach((instanceId) => {
                instances.push(this.locationNames[instanceId])
              })
            }
            //TODO fix existing records so the data isn't pulled in as an array
            //then we can remove this and cleanup the logic for this
            if(Array.isArray(instance.deployed_regions)){
              instance.deployed_regions.forEach((instanceId) => {
                instances.push(this.locationNames[instanceId])
              })
            }

            let regions = instances?.length
              ? instances.filter((x) => Boolean(x)).join(", ")
              : "";
            regions = regions.replaceAll("CONUS", "CONUS ");
            location = this.envLocation === "HYBRID"
              ? regions.length
                ? "Cloud<br>(" + regions + ")"
                : "Cloud"
              : regions;
          }

          let classification = "";
          if (instance.classification_level) {
            const i = this.classificationLevels.findIndex(
              obj => obj.sys_id === instance.classification_level
            );
            if (i > -1) {
              const classificationLevel = this.classificationLevels[i];
              classification = buildClassificationLabel(classificationLevel, "short");
            }
          }

          const instanceData: EnvInstanceSummaryTableData = {
            instanceSysId: instance.sys_id,
            instanceNumber: instanceIndex + 1,
            qty: instance.number_of_instances ? String(instance.number_of_instances) : "",
            vCPU: instance.number_of_vcpus ? String(instance.number_of_vcpus) : "",
            memory: instance.memory_amount ? String(instance.memory_amount) + " GB"  : "",
            storage,
            performance,
            isValid,
          }

          if (this.envLocation !== "ON_PREM") {
            instanceData['location'] = location
          }
          if (this.hasMultipleClassifications) {
            instanceData['classification'] = classification
          }

          this.tableData.push(instanceData);
          instanceIndex++
        }
      }
    }, 0);
  }

  public async loadOnEnter(): Promise<void> {
    const storeEnvData = await CurrentEnvironment.getCurrentEnvironment();
    if (storeEnvData) {
      this.currEnvData = _.clone(storeEnvData);
      this.envLocation = this.currEnvData.env_location;
      this.classificationsCloud = this.currEnvData.env_classifications_cloud;
      this.classificationsOnPrem = this.currEnvData.env_classifications_onprem;
    }
    AcquisitionPackage.regions?.forEach(location => {
      this.locationNames[location.sys_id] = location.name
    })
    this.classificationLevels = await classificationRequirements.getAllClassificationLevels();
    await this.buildTableData();
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

}

export default toNative(EnvironmentSummary)
</script>

