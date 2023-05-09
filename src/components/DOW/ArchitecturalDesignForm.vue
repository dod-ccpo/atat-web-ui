<template>
  <!-- <v-form ref="form"> -->
    <v-container class="container-max-width" fluid>
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Tell us more about your architectural design requirements
          </h1>
          <div class="copy-max-width">
            <p id="IntroP" class="mb-8">
              Use vendor-neutral language in your responses. This will be added 
              to your Description of Work, so avoid including any company names 
              or vendor-unique brand, product, or titles that could impact full 
              and open competition.
            </p>


            <ATATTextArea 
              id="Statement"
              class="textarea-max-width mb-10"
              :value.sync="_statementArchitecturalDesign"
              label="Provide a detailed statement identifying the outcomes and 
                objectives for this requirement"
              helpText="Include any information that would help a CSP to propose
                an architectural design solution."
              :maxChars="800"
              :rules="[$validators.required('Enter a description for your requirement.')]"
            />

            <ATATTextField 
              id="ApplicationsNeedArchitecturalDesign"
              class="textarea-max-width mb-10"
              :optional="true"
              label="Identify any application(s) that need architectural designs"
              :value.sync="_applicationsNeedArchitecturalDesign"
            />

            <ATATCheckboxGroup
              id="ClassificationLevelCheckboxes"
              :value.sync="_dataClassificationsImpactLevels"
              :items="classificationCheckboxes"
              groupLabel="What data classification and impact level(s) do you need an 
                architectural design solution for?"
              name="checkboxes"
              :card="false"
              class="copy-max-width mb-10"
              :rules="[
                $validators.required('Please select at least one classification level.')
              ]"
            />

            <ATATTextArea 
              id="ExternalFactors"
              :optional="true"
              class="textarea-max-width mb-10"
              :value.sync="_externalFactors"
              label="What external factors need to be considered for the deployment?"
              helpText="Include any details about expiring contracts, data center closure, 
                restrictions of applications, etc."
            />

          </div>
        </v-col>
      </v-row>
    </v-container>
  <!-- </v-form> -->
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import { Checkbox } from "types/Global";
import { buildClassificationCheckboxList } from "@/helpers";
import { ClassificationLevelDTO } from "@/api/models";
import classificationRequirements from "@/store/classificationRequirements";

@Component({
  components: {
    ATATCheckboxGroup,
    ATATTextField,
    ATATTextArea,
  }
})

export default class ArchitectureDesignForm extends Vue {
  @Prop({ default: true }) isDOW?: boolean;
  @PropSync("statementArchitecturalDesign") public _statementArchitecturalDesign!: string;
  @PropSync("applicationsNeedArchitecturalDesign") 
  public _applicationsNeedArchitecturalDesign!: string;
  @PropSync("dataClassificationsImpactLevels") public _dataClassificationsImpactLevels!: string[];
  @PropSync("externalFactors") public _externalFactors!: string;

  private classificationLevels: ClassificationLevelDTO[] = [];
  private classificationCheckboxes: Checkbox[] = [];

  private createCheckboxItems(data: ClassificationLevelDTO[]) {
    return buildClassificationCheckboxList(data, "", true, true);
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
  public async loadOnEnter(): Promise<void> {
    this.classificationLevels = await classificationRequirements.getAllClassificationLevels();
    this.classificationCheckboxes =this.createCheckboxItems(this.classificationLevels)

  }

}

</script>
