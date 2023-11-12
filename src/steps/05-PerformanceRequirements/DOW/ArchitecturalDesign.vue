<template>
  <v-form lazy-validation>
    <v-container class="container-max-width" fluid>
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Do you need an architectural design solution to address a known problem or use-case?
          </h1>
          <div class="copy-max-width">
            <p id="IntroP" class="mb-8">
              This objective-based requirement is a good option if you need help with: determining
              the most effective cloud resources, tools, or services needed for your project;
              translating functional requirements into a new technology solution; or guidance on
              the strategic direction of your project. We'll gather details about your situation
              and request CSPs to propose a customized cloud solution based on your unique
              objectives.
            </p>
            <div v-if="showWarning">
              <ATATAlert
              id="ArchitecturalDesignAlert"
              type="warning"
              class="mb-10 mt-2"
              :showIcon="true"
            >
              <template v-slot:content>
                <p class="mr-5 mb-0 font-weight-400 font-size 16">
                  Based on what you previously told us, we recommend selecting “Yes” below.
                  If you don’t need an architectural design solution, you’ll need to revisit
                  <span v-if="showCurrentFunctionsLink">
                    <router-link
                      id="CompleteCurrentEnv"
                      :to="{ name: routeNames.ReplicateAndOptimize }"
                    >Your Current Functions</router-link>
                    or
                  </span>
                  <a
                    id="CompleteXaaS"
                    @click="setDOWSection"
                    @keydown.enter="setDOWSection"
                    @keydown.space="setDOWSection"
                  >XaaS</a>
                  to define performance requirements for your Description of Work.
                </p>
              </template>
            </ATATAlert>
            </div>
            <ATATRadioGroup
              id="ArchitectureOptions"
              ref="ArchitectureOptionsRef"
              :card="true"
              :width="'180'"
              :items="radioOptions"
              :value="architectureDesignNeeds.needs_architectural_design_services"
              @update:value="architectureDesignNeeds.needs_architectural_design_services = $event"
              :rules="[$validators.required('Please select an option.')]"
            />
          </div>

          <ATATAlert
              id="JWCCInfoAlert"
              :showIcon="true"
              type="info"
              class="mt-5 mb-2"
            >
              <template v-slot:content>
                <div>
                  <p>
                    The information you provide in this section allows JWCC cloud service providers
                    to propose and the Government to analyze proposals in a consistent manner. All
                    requirements are presented as a minimum capability for analysis only and will
                    neither limit the actual Cloud Service Offering(s) ordered from the JWCC Catalog
                    during TO performance nor exceed the dollar threshold established within the TO.
                  </p>
                </div>
              </template>
            </ATATAlert>

        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
/*eslint prefer-const: 1 */
import { Component, Hook, Vue, toNative } from "vue-facing-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { RadioButton, SaveOnLeaveRefs } from "types/Global";
import { hasChanges } from "@/helpers";
import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";
import DescriptionOfWork, { defaultDOWArchitecturalNeeds } from "@/store/descriptionOfWork";
import { ArchitecturalDesignRequirementDTO } from "@/api/models";
import AcquisitionPackage from "@/store/acquisitionPackage";
import _ from "lodash";
import { routeNames } from "@/router/stepper";
import ATATAlert from "@/components/ATATAlert.vue";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
 


@Component({
  components: {
    ATATRadioGroup,
    ATATAlert
  }
})

class ArchitecturalDesign extends Vue {

  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs, 
      nextTick: this.$nextTick,
    }).catch()
  }

  public routeNames = routeNames
  public architectureDesignNeeds = defaultDOWArchitecturalNeeds;
  public async setDOWSection(): Promise<void> {
    await DescriptionOfWork.setCurrentDOWSection("XaaS");
    const routerObj = {
      name: routeNames.RequirementCategories,
      query: {
        direction: "next",
        resolver: "",
      }
    }
    routerObj.query.resolver = "RequirementsPathResolver";
    this.$router.push(routerObj)
  }

  public get hasCurrentEnv(): boolean {
    return CurrentEnvironment.currentEnvironment.current_environment_exists === "YES"
  }
  public get replicateAndOptimizeIsNo():boolean {
    return CurrentEnvironment.currentEnvironment
      .current_environment_replicated_optimized === "NO"
  }
  public get hasXaaSNoneApply():boolean {
    return DescriptionOfWork.DOWObject.length === 1
      && DescriptionOfWork.DOWObject[0].serviceOfferingGroupId === "XaaS_NONE";
  }

  public get showCurrentFunctionsLink(): boolean {
    return this.hasCurrentEnv && this.replicateAndOptimizeIsNo;
  }
  public get showWarning(): boolean {
    return (!this.hasCurrentEnv || (this.hasCurrentEnv && this.replicateAndOptimizeIsNo))
      && this.hasXaaSNoneApply
      && this.savedData.needs_architectural_design_services !== "YES"
  }


  public radioOptions: RadioButton[] = [
    {
      id: "YesArchitecture",
      value: "YES",
      label: "Yes.",
    },
    {
      id: "NoArchitecture",
      value: "NO",
      label: "No.",
    },
  ];

  public get currentData(): ArchitecturalDesignRequirementDTO {
    return this.architectureDesignNeeds
  };

  /* eslint-disable camelcase */
  public savedData: ArchitecturalDesignRequirementDTO = {
    source: "DOW",
    statement: "",
    applications_needing_design: "",
    data_classification_levels: "",
    external_factors: "",
    acquisition_package: AcquisitionPackage.packageId,
    needs_architectural_design_services:""
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await DescriptionOfWork.getDOWArchitecturalNeeds();
    if (storeData) {
      this.savedData = _.cloneDeep(storeData);
      this.architectureDesignNeeds = _.cloneDeep(storeData)
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData.needs_architectural_design_services,
      this.savedData.needs_architectural_design_services);
  }

  protected async saveOnLeave(): Promise<boolean> {
    const emptyArchObject = {
      statement: "",
      applications_needing_design: "",
      data_classification_levels: "",
      external_factors: "",
    }
    try {
      if (this.hasChanged()) {
        if(this.currentData.needs_architectural_design_services === "NO"){
          const data = Object.assign(this.currentData, emptyArchObject)
          await DescriptionOfWork.setDOWArchitecturalDesign(data);
        }else{
          await DescriptionOfWork.setDOWArchitecturalDesign(this.currentData);
        }
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }

}
export default toNative(ArchitecturalDesign)
</script>
