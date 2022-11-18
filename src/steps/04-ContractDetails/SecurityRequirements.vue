<template>
  <div>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Let’s find out more about your security requirements
          </h1>
          <div class="copy-max-width">
            <p class="mb-10" id="IntroP">
              Based on what you told us, this project will require the CSP to access classified
              information. You are NOT required to complete a DD Form 254 for this task order.
              However, you will need to identify access requirements that will be included in your
              Description of Work. <a>Learn more about JWCC security requirements</a>
            </p>
          </div>
          <div v-if="hasTopSecret">
            <ATATRadioGroup
              class="copy-max-width mb-10"
              id="ClearanceLevelRadio"
              legend="What clearance level is required for contractor employees to provide your
               training?"
              :items="clearanceLevels"
              :value.sync="selectedClearanceLevels"
            />
            <hr />
          </div>
          <div v-if="hasSecret">
            <p id="SecretMessage" class="mb-5 font-weight-500">
              For your SECRET cloud services and support, what type of classified information will
              be accessed?
            </p>
            <p id="SecretMessage" class="mb-5 ">
              Select all that apply to your SECRET classification level.
            </p>
            <ATATCheckboxGroup
              id="secretSecurityRequirements"
              :value.sync="selectedSecretSecurityRequirements"
              :items="securityRequirementsCheckboxes"
              name="checkboxes"
              :card="false"
              class="copy-max-width"
              :rules="[
              $validators.required('Please select at least one type of classified information.')
            ]"
            />
          </div>
          <hr v-if="hasTopSecret && hasSecret" />
          <div v-if="hasTopSecret">
            <p id="SecretMessage" class="mb-5 font-weight-500">
              For your TOP SECRET cloud services and support, what type of classified information
              will be accessed?
            </p>
            <p id="SecretMessage" class="mb-5 ">
              Select all that apply to your TOP SECRET classification level.
            </p>
            <ATATCheckboxGroup
              id="secretSecurityRequirements"
              :value.sync="selectedTopSecretSecurityRequirements"
              :items="securityRequirementsCheckboxes"
              name="checkboxes"
              :card="false"
              class="copy-max-width"
              :rules="[
              $validators.required('Please select at least one type of classified information.')
            ]"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script lang="ts">

import { Component, Mixins } from "vue-property-decorator";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import classificationRequirements from "@/store/classificationRequirements";
import { ClassificationLevelDTO } from "@/api/models";
import { Checkbox, RadioButton, SecurityRequirement } from "types/Global";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
@Component({
  components: {
    ATATRadioGroup,
    ATATCheckboxGroup,
    ATATAlert
  }
})
export default class SecurityRequirements extends Mixins(SaveOnLeave) {
private storedClassification: ClassificationLevelDTO[] = [];
private selectedSecretSecurityRequirements: string[] = [];
private selectedTopSecretSecurityRequirements: string[] = [];
private selectedClearanceLevels: string[] = [];
private hasSecret = false;
private hasTopSecret = false;
private securityRequirementsCheckboxes: Checkbox[] = [
  {
    id: "COMSEC",
    label: "Communication Security (COMSEC) Information",
    value: "COMSEC",
    description: "Includes accountable or non-accountable COMSEC information and controlled" +
      " crytographic items (CCI)",
  },
  {
    id: "RestrictedData",
    label: "Restricted Data",
    value: "restrictedData",
  },
  {
    id: "CNWDI",
    label: "Critical Nuclear Weapon Design Information (CNWDI)",
    value: "CNWDI",
    description:"If CNWDI access is required, then Restricted Data must also be selected."
  },
  {
    id: "FormerlyRestrictedData",
    label: "Formerly Restricted Data",
    value: "formerlyRestrictedData",
  },
  {
    id: "SCI",
    label: "National Intelligence Information: Sensitive Compartmented Information (SCI)",
    value: "SCI",
  },
  {
    id: "NOSCI",
    label: "National Intelligence Information: Non-SCI",
    value: "NONSCI",
  },
  {
    id: "SAP",
    label: "Special Access Program (SAP) Information",
    value: "SAP",
  },
  {
    id: "NATO",
    label: "North Atlantic Treaty Organization (NATO) Information",
    value: "NATO",
  },
  {
    id: "FGI",
    label: "Foreign Government Information (FGI)",
    value: "FGI",
  },
  {
    id: "ACCM",
    label: "Alternative Compensatory Control Measures (ACCM) Information",
    value: "ACCM",
  },
  {
    id: "CUI",
    label: "Controlled Unclassified Information (CUI)",
    value: "CUI",
  },
  {
    id: "Other",
    label: "Other - Secure Internet Protocol Router Network (SIPRNET) / Joint" +
      " Worldwide Intelligence Communciations System (JWICS)",
    value: "Other",
  },
]
private clearanceLevels: RadioButton[] = [
  {
    id: "TopSecret",
    label: "TopSecret",
    value: "TS",
  },
  {
    id: "TS/SCI",
    label: "Top Secret/Sensitive Compartmented Information (TS/SCI)",
    value: "TS/SCI",
  },
];
public savedData: SecurityRequirement[] = []

public get currentData(): SecurityRequirement[] {
  let requirements:SecurityRequirement[] = []
  if(this.hasSecret){
    requirements.push({
      type:"SECRET",
      // eslint-disable-next-line camelcase
      classification_information_type: this.selectedSecretSecurityRequirements
    })
  }
  if(this.hasTopSecret){
    requirements.push({
      type:"SECRET",
      // eslint-disable-next-line camelcase
      classification_information_type: this.selectedTopSecretSecurityRequirements
    })
  }
  return requirements
}


private hasChanged(): boolean {
  return hasChanges(this.currentData, this.savedData);
}

protected async saveOnLeave(): Promise<boolean> {
  console.log(this.currentData, this.savedData)
  try {
    if (this.hasChanged()) {
      classificationRequirements.setSecurityRequirements(this.currentData)
    }
  } catch (error) {
    console.log(error);
  }
  return true;
}
public async loadOnEnter(): Promise<void> {
  this.storedClassification = classificationRequirements.selectedClassificationLevels;
  this.storedClassification.forEach((classification) =>{
    if(classification.classification === "TS"){
      this.hasTopSecret = true
    }
    if(classification.classification === "S"){
      this.hasSecret = true
    }
  })
  let storeData = classificationRequirements.securityRequirements
  if(storeData){
    storeData.forEach((requirement)=>{
      if(requirement.type === "SECRET"){
        this.selectedSecretSecurityRequirements = requirement.classification_information_type
      }
      if(requirement.type === "TOPSECRET"){
        this.selectedTopSecretSecurityRequirements = requirement.classification_information_type
      }
    })
  }
}

public async mounted(): Promise<void> {
  await this.loadOnEnter();
}
}
</script>

