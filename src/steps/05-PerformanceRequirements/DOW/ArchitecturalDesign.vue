<template>
  <v-form ref="form" lazy-validation>
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

            <ATATRadioGroup
              id="ArchitectureOptions"
              :card="true"
              :width="180"
              :items="radioOptions"
              :value.sync="architectureDesignNeeds"
              :rules="[$validators.required('Please select an option.')]"
             />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { RadioButton } from "types/Global";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import DescriptionOfWork from "@/store/descriptionOfWork";

@Component({
  components: {
    ATATRadioGroup
  }
})

export default class ArchitecturalDesign extends Mixins(SaveOnLeave) {
  public architectureDesignNeeds = ""


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

  public get currentData(): string {
    return this.architectureDesignNeeds
  };

  public savedData =""

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = DescriptionOfWork.DOWHasArchitecturalDesignNeeds;

    if (storeData !== null ) {
      this.savedData = storeData?"YES":"NO";
      this.architectureDesignNeeds = this.savedData
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        const needsArchDesign = this.architectureDesignNeeds === "YES";
        await DescriptionOfWork.setDOWHasArchitecturalDesign(needsArchDesign);
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }  

}

</script>
