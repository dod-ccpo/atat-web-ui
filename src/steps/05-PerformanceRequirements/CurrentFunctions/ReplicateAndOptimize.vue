<template>
  <v-form ref="form" lazy-validation>
    <v-container class="container-max-width" fluid>
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Do you want to replicate or optimize your current functions using JWCC offerings?
          </h1>
          <div class="copy-max-width">
            <p id="IntroP" class="mb-8">
              If your current environment does not meet your current requirements,
              select “No” below, and the instance details that you previously provided
              will serve only as background information within your Description of Work.
            </p>
            <div v-if="showWarning">
              <ATATAlert
              id="ReplicateAndOptimizeAlert"
              type="warning"
              class="mb-10 mt-2"
              :showIcon="true"
            >
              <template v-slot:content>
                <p class="mr-5 mb-0 font-weight-400 font-size 16">
                  Based on what you previously told us, we recommend selecting either
                  “Replicate” or “Optimize” below. If you don’t have requirements
                  related to your current functions, you’ll need to revisit
                  <router-link
                    id="CompleteArchitectural"
                    :to="{ name: routeNames.ArchitecturalDesign }"
                  >
                  Architectural Design Solution</router-link>
                  or
                  <a
                    id="CompleteXaaS"
                    @click="setDOWSection"
                    @keydown.enter="setDOWSection"
                    @keydown.space="setDOWSection"
                  >
                    XaaS</a>
                  to define requirements for
                  your Description of Work.
                </p>
              </template>
            </ATATAlert>
            </div>
            <ATATRadioGroup
              class="mb-5"
              id="ReplicateOptimizeOptions"
              ref="ReplicateOptimizeOptionsRef"
              :card="true"
              :items="radioOptions"
              :value="currEnvDTO.current_environment_replicated_optimized"
              @update:value="currEnvDTO.current_environment_replicated_optimized = $event"
              :rules="[$validators.required('Please select an option.')]"
            />

            <ATATExpandableLink aria-id="ROFAQ">
              <template v-slot:header>
                What does it mean to replicate or optimize current functions?
              </template>
              <template v-slot:content>
                <p class="mb-4">
                  During the solicitation process, Cloud Service Providers (CSPs) will
                  be asked to reference the instance details you previously provided
                  within the Background section and deliver a proposal based on
                  your choice to either “replicate” or “optimize” your current functions.
                </p>
                <ul class="_atat-ul">
                  <li class="pb-2">
                    To replicate your current functions, a CSP will be expected to perform
                    a “lift and shift” to recreate your environment and configurations, as is.
                  </li>
                  <li class="pb-4">
                    To optimize your current functions, a CSP will be expected to evaluate
                    your current environment configurations and propose an improved or
                    modernized solution.
                  </li>
                </ul>
              </template>
            </ATATExpandableLink>


          </div>
          <ATATAlert
              id="JWCCInfoAlert"
              :showIcon="true"
              type="info"
              class="mt-8 mb-2"
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
import { Component, Vue, toNative, Hook } from "vue-facing-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { RadioButton, SaveOnLeaveRefs } from "types/Global";
import CurrentEnvironment, 
{ defaultCurrentEnvironment } from "@/store/acquisitionPackage/currentEnvironment";
import _ from "lodash";
import { hasChanges } from "@/helpers";
import { routeNames } from "@/router/stepper";
import ATATAlert from "@/components/ATATAlert.vue";
import DescriptionOfWork from "@/store/descriptionOfWork";
import ATATExpandableLink from "@/components/ATATExpandableLink.vue";
import Steps from "@/store/steps";
import { beforeRouteLeaveFunction, From, To } from "@/mixins/saveOnLeave";


@Component({
  components: {
    ATATExpandableLink,
    ATATRadioGroup,
    ATATAlert,
  }
})

class ReplicateAndOptimize extends Vue {

    
  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs, 
      nextTick: this.$nextTick,
    }).catch()
  }

  public currEnvDTO = defaultCurrentEnvironment;
  public routeNames = routeNames
  public radioOptions: RadioButton[] = [
    {
      id: "YesReplicate",
      value: "YES_REPLICATE",
      label: "Replicate my current functions."
    },
    {
      id: "YesOptimize",
      value: "YES_OPTIMIZE",
      label: "Optimize my current functions."
    },
    {
      id: "NoReplicateOrOptimize",
      value: "NO",
      label: "No. I don’t want to replicate or optimize my current functions."
    },
  ];
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

  public get hasXaaSNoneApply():boolean {
    return DescriptionOfWork.DOWObject.length === 1 
      && DescriptionOfWork.DOWObject[0].serviceOfferingGroupId === "XaaS_NONE";
  }

  public get architecturalDesignIsNo():boolean {
    return DescriptionOfWork.DOWArchitectureNeeds.needs_architectural_design_services === "NO"
  }

  public get showWarning(): boolean {
    return this.hasXaaSNoneApply && this.architecturalDesignIsNo
      && (this.savedData.replicatedOrOptimized === "" 
      || this.savedData.replicatedOrOptimized === "NO");
  }

  public get currentData(): Record<string, string> {
    return {
      replicatedOrOptimized: this.currEnvDTO.current_environment_replicated_optimized,
    }
  };

  public savedData: Record<string, string> = {
    replicatedOrOptimized: ""
  }

  public async mounted(): Promise<void> {
    const comingFrom = Steps.prevStepName;
    if (comingFrom !== routeNames.DOWLandingPage && comingFrom !== routeNames.ReplicateDetails) {
      this.$router.push({
        name: routeNames.DOWLandingPage,
      }).catch(() => console.log("error navigating to DOW Landing Page"));
    }
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await CurrentEnvironment.getCurrentEnvironment();
    if (storeData) {
      this.currEnvDTO = _.cloneDeep(storeData);
      this.savedData.replicatedOrOptimized = storeData.current_environment_replicated_optimized;
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await CurrentEnvironment.setCurrentEnvironment(this.currEnvDTO);
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }  
}
export default toNative(ReplicateAndOptimize)
</script>
