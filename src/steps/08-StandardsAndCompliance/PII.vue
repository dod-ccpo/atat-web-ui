<template>
  <v-form ref="form" lazy-validation>
    <div class="mb-7">
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="page-header">
              Let’s find out if your project includes Personally Identifiable Information (PII)
            </h1>

            <ATATAlert
              id="PIIAlert"
              type="callout"
              :showIcon="false"
              class="copy-max-width my-10"
            >
              <template v-slot:content>
                <h2>What is PII?</h2>
                <p class="mt-2 mb-0">
                  PII is information about an individual which identifies, links, relates, or is
                  unique to an individual. Examples include social security number, age, military
                  rank, civilian grade, etc. that can be used to distinguish or track an 
                  individual's identity.
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
              :rules="[$validators.required('Please select an option')]"
            />

            <ATATExpandableLink aria-id="PIIFAQ">
              <template v-slot:header>
                Why do we need to know about PII?
              </template>
              <template v-slot:content>
                <p class="mb-4">
                  If this effort provides for the design, development, or operation of a system of
                  records on individuals (in whole or in part), then the Contracting Officer must
                  include the following clauses in the solicitation:
                </p>
                <ul>
                  <li class="pb-2">
                    Privacy Act Notification,
                    <a
                      id="PrivacyActLink1"
                      class="_text-link"
                      href="https://www.acquisition.gov/far/52.224-1"
                      target="_blank"
                    >
                      FAR <span class="_external-link">52.224-1</span>
                    </a>
                  </li>
                  <li class="pb-4">
                    Privacy Act,
                    <a
                      id="PrivacyActLink2"
                      class="_text-link"
                      href="https://www.acquisition.gov/far/52.224-2"
                      target="_blank"
                    >
                      <span class="_external-link">FAR 52.224-2</span>
                    </a>
                  </li>
                </ul>
                <p>
                  For more information, reference
                  <a
                    id="PrivacyActLink3"
                    class="_text-link"
                    href="https://www.acquisition.gov/far/subpart-24.1"
                    target="_blank"
                  >
                    <span class="_external-link">FAR 24.1, Protection of Individual Privacy.</span>
                  </a>
                </p>
              </template>
            </ATATExpandableLink>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-form>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import {Component, Mixins} from "vue-property-decorator";

import ATATAlert from "@/components/ATATAlert.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue"
import ATATExpandableLink from "@/components/ATATExpandableLink.vue";

import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import SaveOnLeave from "@/mixins/saveOnLeave";
import LoadOnEnter from "@/mixins/loadOnEnter";
import { ReferenceColumn, SensitiveInformationDTO } from "@/api/models"
import { hasChanges } from "@/helpers";

import {RadioButton} from "../../../types/Global";

@Component({
  components: {
    ATATAlert,
    ATATExpandableLink,
    ATATRadioGroup,
  },
})

export default class PII extends  Mixins(LoadOnEnter,SaveOnLeave) {
  private pIIOptions: RadioButton[] = [
    {
      id: "YesPII",
      label: "Yes. This contract action will include a system of records with PII.",
      value: "YES",
    },
    {
      id: "NoPII",
      label: "No.",
      value: "NO",
    },
  ];

  public selectedPIIOption = AcquisitionPackage.sensitiveInformation?.pii_present || "";

  private get currentData(): SensitiveInformationDTO {
    return {
      pii_present: this.selectedPIIOption || "",
      acquisition_package: AcquisitionPackage.packageId
    };
  }

  private savedData: SensitiveInformationDTO = {
    pii_present: "",
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await AcquisitionPackage
      .loadData<SensitiveInformationDTO>(
        { storeProperty: StoreProperties.SensitiveInformation }
      );
    if (storeData) {
      this.savedData = {
        pii_present: storeData.pii_present
      }
    }
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage
          .saveData<SensitiveInformationDTO>({
            data: this.currentData, 
            storeProperty: StoreProperties.SensitiveInformation
          });
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }
  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

}
</script>
