<template>
  <v-form ref="form" lazy-validation>
    <div class="mb-7">
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="page-header">
              Let’s look into the Freedom of Information Act (FOIA)
            </h1>

            <ATATAlert
              id="FOIAAlert"
              type="callout"
              :showIcon="false"
              class="copy-max-width my-10"
            >
              <template v-slot:content>
                <h2>Public Disclosure of Information</h2>
                <p class="mt-2">
                  All task orders, including the work statement, Security Classification, DD Form 
                  254, and other government-generated documents incorporated into a task order by 
                  reference are subject to disclosure under FOIA.
                </p>
                <p class="mb-0">
                  If public disclosure of information would be considered harmful to a government 
                  interest, then document(s) should be marked for Controlled Unclassified 
                  Information (CUI) to alert the recipient that an exemption may apply. FOIA 
                  requests for any documents marked CUI will be referred to the Mission Partner’s 
                  FOIA office for response. 
                  <a role="button"
                    id="FOIALearnMore"
                    tabindex="0"
                    @click="openSlideoutPanel"
                    @keydown.enter="openSlideoutPanel"
                    @keydown.space="openSlideoutPanel">
                    Learn more about FOIA.
                  </a>
                </p>
              </template>
            </ATATAlert>

            <ATATRadioGroup
              class="copy-max-width mb-10"
              id="FOIAOptions"
              legend="Have you provided any CUI information in this acquisition package that, 
                if released, would be harmful to the government?"
              :items="fOIAOptions"
              :value.sync="potentialToBeHarmful"
              :rules="[$validators.required('Please select an option')]"
            />

            <ATATExpandableLink aria-id="FOIAFAQ">
              <template v-slot:header>
                How does FOIA impact my acquisition package?
              </template>
              <template v-slot:content>
                <p>
                  Generally, the work statements describe the government’s requirements 
                  and are in the public domain prior to award, having been disclosed to 
                  offerors as part of the Request for Quote/Proposal.
                </p>
                <p>
                  If a work statement contains information that has not been given a 
                  security classification under the criteria of an Executive Order, but 
                  the disclosure of which would be considered harmful to a government 
                  interest, one or more FOIA exemptions may apply. In this instance, 
                  the Description of Work should be marked for Controlled Unclassified 
                  Information (CUI) and each paragraph that contains CUI information 
                  should also be marked to alert the recipient that an exemption may apply.  
                </p>
                <p>
                  Responsibility for the marking of CUI information is with the Mission 
                  Partner. The CUI legend ensures that a recipient is aware of the status 
                  of the information in the document; it is not a form of classification 
                  to protect security interests.
                </p>
                <p class="mb-0">
                  FOIA mandates that releasable information be segregated from exempted 
                  information within a document; an entire document cannot be exempted 
                  if only a portion is considered vulnerable to a security risk. A document 
                  marked CUI in its entirety, but wherein the information is not segregated 
                  as set out above, will be referred to the Mission Partner’s FOIA office for 
                  response to the FOIA requester. The Contracting Office can only protect 
                  from disclosure of a document that has been appropriately marked when it 
                  is submitted as part of a complete requirements package.
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
import { Component, Mixins } from "vue-property-decorator";

import ATATAlert from "@/components/ATATAlert.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue"
import ATATExpandableLink from "@/components/ATATExpandableLink.vue";
import FOIALearnMore from "./FOIALearnMore.vue";

import SlideoutPanel from "@/store/slideoutPanel/index";

import { RadioButton, SlideoutPanelContent } from "../../../types/Global";
import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { SensitiveInformationDTO } from "@/api/models"
import { hasChanges } from "@/helpers";

@Component({
  components: {
    ATATAlert,
    ATATExpandableLink,
    ATATRadioGroup,
    FOIALearnMore,
  },
})

export default class FOIA extends Mixins(SaveOnLeave) {

  public potentialToBeHarmful 
    = AcquisitionPackage.sensitiveInformation?.potential_to_be_harmful || "";

  private fOIAOptions: RadioButton[] = [
    {
      id: "Yes",
      label: "Yes.",
      value: "YES",
    },
    {
      id: "No",
      label: "No.",
      value: "NO",
    },
  ];

  private get currentData(): SensitiveInformationDTO {
    return {
      potential_to_be_harmful: this.potentialToBeHarmful || "",
      acquisition_package: AcquisitionPackage.packageId
    };
  }

  private savedData: SensitiveInformationDTO = { 
    potential_to_be_harmful: "" 
  };

  public async mounted(): Promise<void> {
    const slideoutPanelContent: SlideoutPanelContent = {
      component: FOIALearnMore,
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

  public async loadOnEnter(): Promise<void> {
    const storeData = await AcquisitionPackage
      .loadData<SensitiveInformationDTO>({storeProperty: StoreProperties.SensitiveInformation});
    if (storeData) {
      if (Object.prototype.hasOwnProperty.call(storeData, 'potential_to_be_harmful')) {
        this.savedData = {
          potential_to_be_harmful: storeData.potential_to_be_harmful,
        }
      }
    } else {
      AcquisitionPackage.setSensitiveInformation(this.currentData);
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
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
