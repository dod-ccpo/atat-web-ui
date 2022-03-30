<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Let's find out if your effort provides for Personally Identifiable Information
          </h1>

          <ATATAlert
            id="PIIAlert"
            type="info"
            :showIcon="false"
            class="copy-max-width my-10"
          >
            <template v-slot:content>
              <h2>Personally Identifiable Information (PII)</h2>
              <p class="mt-2 mb-0">
                PII is information about an individual which identifies, links, relates, or is
                unique to an individual. Examples include social security number, age, military
                rank, civilian grade, etc. that can be used to distinguish or track an individual's
                identity.
              </p>
            </template>
          </ATATAlert>

          <ATATRadioGroup
            class="copy-max-width mb-10"
            id="PIIOptions"
            legend="Does this effort provide for the design, development, or operation of a system
              of records on individuals by the contractor (in whole or in part)?"
            :items="pIIOptions"
            :value.sync="selectedPIIOption"
          />

          <ATATExpandableLink aria-id="PIIFAQ">
            <template v-slot:header>
              Why do we need to know about PII?
            </template>
            <template v-slot:content>
              <p>
                If this effort provides for the design, development, or operation of a system of
                records on individuals (in whole or in part), then the contracting officer must
                include the following clauses in the solicitation:
              </p>
              <ul>
                <li class="pb-2">
                  Privacy Act Notification,
                  <a class="text-link" href="https://www.acquisition.gov/far/52.224-1" target="_blank">
                    FAR 52.224-1
                  </a>
                </li>
                <li class="pb-4">
                  Privacy Act,
                  <a class="text-link" href="https://www.acquisition.gov/far/52.224-2" target="_blank">
                    FAR 52.224-2
                  </a>
                </li>
              </ul>
              <p>
                For more information, reference
                <a class="text-link" href="https://www.acquisition.gov/far/subpart-24.1" target="_blank">
                   FAR 24.1, Protection of Individual Privacy.
                </a>
              </p>
            </template>
          </ATATExpandableLink>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component} from "vue-property-decorator";

import ATATAlert from "@/components/ATATAlert.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue"
import ATATExpandableLink from "@/components/ATATExpandableLink.vue";
import {RadioButton} from "../../../types/Global";

@Component({
  components: {
    ATATAlert,
    ATATExpandableLink,
    ATATRadioGroup,
  },
})

export default class PII extends Vue {
  private selectedPIIOption = "";
  private pIIOptions: RadioButton[] = [
    {
      id: "YesPII",
      label: "Yes. This contract action will include a system of records with PII.",
      value: "Yes",
    },
    {
      id: "NoPII",
      label: "No.",
      value: "No",
    },
  ];
}
</script>
