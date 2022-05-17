<template>
  <div>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            What classification level(s) will be required for your cloud resources and/or services?
          </h1>
          <div class="copy-max-width">
            <p class="mb-10" id="IntroP">
              In the next section, we will dive into the types of resources, tools, and services
              that you need for this acquisition. The classification level(s) that you select below
              will be applied to any performance requirements that you specify. If you need more
              than one level, we will walk you through what is required within each level later.
            </p>
            <p id="SelectMessage">
              Select all that apply to your contracting effort.
            </p>
          </div>
          <ATATCheckboxGroup
            id="ClassificationLevelCheckboxes"
            :value.sync="selectedOptions"
            :hasOtherValue="true"
            :items="checkboxItems"
            name="checkboxes"
            :card="false"
            class="copy-max-width"
            :rules="[
              $validators.required('Please select at least one classification level.')
            ]"
          />
          <ATATAlert
            id="ClassificationRequirementsAlert"
            v-show="isIL6Selected === 'true'"
            type="info"
            class="copy-max-width my-10"
          >
            <template v-slot:content>
              <p class="mb-0">
                Contracts requiring access to classified information (IL6 level and above) must
                complete a <strong>DD Form 254, DoD Contract Security Classification
                Specification.</strong> We will walk you through uploading this form next.
              </p>
            </template>
          </ATATAlert>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script lang="ts">
/* eslint-disable camelcase */
import vue from 'vue'
import { Component, Watch } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import { Checkbox } from "../../../types/Global";
import ATATAlert from "@/components/ATATAlert.vue";

@Component({
  components: {
    ATATCheckboxGroup,
    ATATAlert
  }
})

export default class ClassificationRequirements extends vue {
  public selectedOptions: string[] = [];
  public isIL6Selected = ''
  private checkboxItems: Checkbox[] = [
    {
      id: "UnclassifiedImpactLevel2",
      label: `Unclassified / Impact Level 2 (IL2)`,
      value: 'IL2',
      description: "",
    },
    {
      id: "UnclassifiedImpactLevel4",
      label: `Unclassified / Impact Level 4 (IL4)`,
      value: 'IL4',
      description: "",
    },
    {
      id: "UnclassifiedImpactLevel5",
      label: `Unclassified / Impact Level 5 (IL5)`,
      value: 'IL5',
      description: "",
    },
    {
      id: "SecretImpactLevel6",
      label: `Secret / Impact Level 6 (IL6)`,
      value: 'IL6',
      description: "",
    },
  ];

  @Watch("selectedOptions")
  public selectedOptionsChange(newVal: string[]): void {
    this.isIL6Selected
      = newVal.indexOf('IL6') > -1 ? "true" : "false";
  }
}
</script>

