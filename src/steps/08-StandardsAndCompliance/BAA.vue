<template>
  <v-form ref="form" lazy-validation>
    <div class="mb-7">
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="page-header">
              Let’s find out if you need a Business Associates Agreement
            </h1>

            <ATATAlert 
              id="BAAAlert"
              type="callout" 
              :showIcon="false" 
              class="copy-max-width my-10"
            >
              <template v-slot:content>
                <h2>Business Associate Agreements (BAA)</h2>
                <p class="mt-2 mb-0">
                  <strong>Protected Health Information (PHI)</strong> is information 
                  which relates to the past, present, or future physical or mental 
                  health or condition of any individual. Per the Health Insurance 
                  Portability and Accountability Act of 1996 (HIPAA), a BAA is required 
                  between the Mission Partner and the business associate to provide assurance 
                  that the business associate will appropriately safeguard PHI when 
                  it is transmitted or maintained in electronic (e-PHI) or any other form. 
                  <a role="button"
                    id="LearnMoreBAA"
                    tabindex="0"
                    @click="openSlideoutPanel"
                    @keydown.enter="openSlideoutPanel"
                    @keydown.space="openSlideoutPanel">
                    Learn more about business associates and BAAs.
                  </a>
                </p>
              </template>
            </ATATAlert>

            <ATATRadioGroup
              class="copy-max-width mb-10"
              id="BAARadioOptions"
              legend="Does this effort provide for definition of a Business Associate 
                who may be involved in but not limited to design or development (in whole 
                or in part) of the system, and/or for creating, receiving, transmitting, 
                managing, and disposing of PHI?"
              :items="bAAOptions"
              :value.sync="selectedBAAOption"
              :rules="[$validators.required('Please select an option')]"
            />

            <ATATAlert 
              id="BAASampleProvisionsAlert"
              v-show="selectedBAAOption === 'YES'"
              type="info" 
              class="copy-max-width my-10"
            >
              <template v-slot:content>
                <p>
                  As a Mission Partner, it is your responsibility to obtain 
                  the appropriate agreements with your business associate(s). 
                  Business associates must also obtain BAAs from their subcontractors. 
                  These agreements shall be maintained by your office and are not included 
                  in your acquisition package. 
                </p>
                <p class="mb-0">
                  For sample BAA provisions, visit 
                  <a 
                    :href="baaHref" 
                    target="_blank" 
                  >
                    Health Information Privacy, Business Associate Contracts<span 
                    class="_external-link">.</span>
                  </a>
                </p>
              </template>
            </ATATAlert>

            <ATATExpandableLink aria-id="AboutBusinessAssociates">
              <template v-slot:header>
                Why do we need to know about business associates?
              </template>
              <template v-slot:content>
                <p>
                  Per HIPAA, a BAA is required when PHI is transmitted and maintained in electronic 
                  or any other form and in combination with one or more of the 18 
                  identifiers defined by HIPAA.
                </p>
                <p>
                  The Government strives to protect the confidentiality, integrity, and 
                  availability of e-PHI by permitting a business associate to create, 
                  receive, maintain, or transmit e-PHI on its behalf; this is the case 
                  only if there is written agreement between the Mission Partner and 
                  the business associate that provides assurance that the business 
                  associate will appropriately safeguard the e-PHI. Business associate 
                  must also obtain same business associate agreements from its subcontractors. 
                </p>
                <p>
                  For more information, reference
                  <a 
                    :href="moreInfoHref"
                    class="_text-link _external-link"
                    target="_blank"
                  >
                    Business Associate and PHI, CFR title 45 part 
                    <span class="_external-link">160.103</span>
                  </a> 
                  and BAA, CFR title 45 part 164.308 (b)(4).        
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
import ATATExpandableLink from "@/components/ATATExpandableLink.vue"
import BAALearnMore from "./BAALearnMore.vue";

import SlideoutPanel from "@/store/slideoutPanel/index";
import { RadioButton, SlideoutPanelContent } from "../../../types/Global";
import {SensitiveInformationDTO} from "@/api/models";
import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import {hasChanges} from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import LoadOnEnter from "@/mixins/loadOnEnter";

@Component({
  components: {
    ATATAlert,
    ATATExpandableLink,
    ATATRadioGroup,
    BAALearnMore,
  },
})

export default class BAA extends Mixins(LoadOnEnter,SaveOnLeave) {
  private baaHref = `https://www.hhs.gov/hipaa/for-professionals/covered-entities/
    sample-business-associate-agreement-provisions/index.html`;

  private moreInfoHref= `https://www.ecfr.gov/current/title-45/
    subtitle-A/subchapter-C/part-160/subpart-A/section-160.103`;


  private selectedBAAOption = AcquisitionPackage.sensitiveInformation?.baa_required || "";
  private bAAOptions: RadioButton[] = [
    {
      id: "YesBAA",
      label: "Yes. This contract effort will require a BAA to safeguard PHI.",
      value: "YES",
    },
    {
      id: "NoBAA",
      label: "No.",
      value: "NO",
    },
  ];

  public async mounted(): Promise<void> {
    const slideoutPanelContent: SlideoutPanelContent = {
      component: BAALearnMore,
      title: "Learn More",
    }
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
    await this.loadOnEnter();
  }

  public openSlideoutPanel(e: Event): void {
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }

  private get currentData(): SensitiveInformationDTO {
    return {
      baa_required: this.selectedBAAOption || "",
      acquisition_package: AcquisitionPackage.packageId
    };
  }

  private savedData: SensitiveInformationDTO = {
    baa_required: "",
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await AcquisitionPackage
      .loadData<SensitiveInformationDTO>({storeProperty: StoreProperties.SensitiveInformation});
    if (storeData) {
      this.savedData = {
        baa_required: storeData.baa_required,
      } 
    }
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage
          .saveData<SensitiveInformationDTO>( {data: this.currentData, 
            storeProperty: StoreProperties.SensitiveInformation});
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }
}
</script>
