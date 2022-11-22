<template>
  <v-form ref="form" lazy-validation>
    <div class="mb-7">
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="page-header mb-3">
              Let’s look into your Section 508 Accessibility requirements
            </h1>
            <div class="copy-max-width">
              <p id="IntroP" class="mb-10">
                The overarching JWCC Contract provides the following language to
                ensure CSPs comply with the government’s Section 508 Accessibility
                Standards for Cloud Computing. If your project requires different
                compliance standards, we’ll gather that info next. Learn more
                about Section 508.
              </p>
              <ATATAlert 
                id="Section508Callout" 
                type="callout"
                maxHeight="460"
                class="mb-10"
              >
                <template slot="content">
                  <h2>
                    Section 508 Accessibility Standards for Cloud Computing
                  </h2>
                  <p>
                    Information and Communication Technology (ICT) Accessibility
                    Requirements Statement per the Revised Section 508 of the
                    Rehabiliation Act
                  </p>

                  <span class="font-size-20 _semibold mb-4 d-block">
                    Electronic Content Technical Criteria:
                  </span>
                  <ul class="_atat-ul">
                    <li>
                      <strong>E205.1 General</strong> - Electronic
                      content shall comply with E205.
                    </li>
                    <li>
                      <strong>E205.2 Public Facing</strong> -
                      Electronic content that is public facing shall conform to
                      the accessibility requirements specified in E205.4.
                    </li>
                    <li>
                      <strong>602 Support Documentation</strong>
                    </li>
                    <li>
                      <strong>603 Support Services</strong>
                    </li>
                    <li>
                      <strong>302 Functional Performance Criteria</strong>
                    </li>
                  </ul>

                  <span class="font-size-20 _semibold mb-4 d-block">
                    Software Exceptions:
                  </span>
                  <ul class="_atat-ul">
                    <li>
                      <strong>E207.1 General</strong> - Software
                      that is assistive technology and that supports the
                      accessibility services of the platform shall not be required
                      to conform to the requirements in Chapter 5.
                    </li>
                    <li>
                      <strong class="mb-2 d-block">E207.2 WCAG Conformance -</strong>
                      <ul class="_atat-ul">
                        <li>
                          Software that is assistive technology and that supports
                          the accessibility services of the platform shall not be
                          required to conform to E207.2.
                        </li>
                        <li>
                          Non-web software shall not be required to conform to the
                          following four Success Criteria in WCAG 2.0: 2.4.1
                          Bypass Blocks; 2.4.5 Multiple Ways; 3.2.3 Consistent
                          Navigation; and 3.2.4 Consistent Identification.
                        </li>
                        <li class="pb-0">
                          Non-Web software shall not be required to conform to
                          Conformance Requirement 3 Complete Processes in WCAG
                          2.0.
                        </li>
                      </ul>
                    </li>
                  </ul>

                  <span class="font-size-20 _semibold mb-4 d-block">
                    Functional Performance Criteria:
                  </span>
                  <ul class="_atat-ul">
                    <li>
                      <strong>301.1 Scope</strong> - The
                      requirements of Chapter 3 shall apply to ICT where required
                      by 508 Chapter 2 (Scoping Requirements), 255 Chapter 2
                      (Scoping Requirements), and where otherwise referenced in
                      any other chapter of the Revised 508 Standards or Revised
                      255 Guidelines.
                    </li>
                    <li>
                      <strong>302.1 Without Vision</strong> - Where
                      a visual mode of operation is provided, ICT shall provide at
                      least one mode of operation that does not require user
                      vision.
                    </li>
                    <li>
                      <strong>302.2 With Limited Vision</strong> -
                      Where a visual mode of operation is provided, ICT shall
                      provide at least one mode of operation that enables users to
                      make use of limited vision.
                    </li>
                    <li>
                      <strong>302.3 Without Perception of Color</strong> 
                      - Where a visual mode of operation is provided, ICT shall
                      provide at least one visual mode of operation that does not
                      require user perception of color.
                    </li>
                    <li>
                      <strong>302.4 Without Hearing</strong> - Where
                      an audible mode of operation is provided, ICT shall provide
                      at least one mode of operation that does not require user
                      hearing.
                    </li>
                    <li>
                      <strong>302.5 With Limited Hearing</strong> -
                      Where an audible mode of operation is provided, ICT shall
                      provide at least one mode of operation that enables users to
                      make use of limited hearing.
                    </li>
                    <li>
                      <strong>302.6 Without Speech</strong> - Where
                      speech is used for input, control, or operation, ICT shall
                      provide at least one mode of operation that does not require
                      user speech.
                    </li>
                    <li>
                      <strong>302.7 With Limited Manipulation</strong>
                      - Where a manual mode of operation is provided, ICT shall
                      provide at least one mode of operation that does not require
                      fine motor control or simultaneous manual operations.
                    </li>
                    <li>
                      <strong>302.8 With Limited Reach and Strength</strong>
                      - Where a manual mode of operation is provided, ICT shall
                      provide at least one mode of operation that is operable with
                      limited reach and limited strength.
                    </li>
                    <li>
                      <strong>302.9 With Limited Language, Cognitive, 
                      and Learning Abilities</strong> - ICT shall provide features 
                      making its use by individuals with limited cognitive, language, 
                      and learning abilities simpler and easier.
                    </li>
                  </ul>
                </template>
              </ATATAlert>
              <ATATRadioGroup
                id="Section508RadioGroup"
                legend="Are the above Section 508 requirements sufficient for this acquisition?"
                :value.sync="selected508Response"
                :items="section508Options"
                name="Section508RadioGroup"
                class="mt-3 mb-8"
                :rules="[$validators.required('Please select an option')]"
              />

              <ATATExpandableLink aria-id="AboutBusinessAssociates">
                <template v-slot:header>
                  How do I determine which Section 508 accessibility requirements apply 
                  to my acquisition?
                </template>
                <template v-slot:content>
                  <p>
                    (To be completed in next milestone)
                  </p>
                </template>
              </ATATExpandableLink>

            </div>
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
import ATATExpandableLink from "@/components/ATATExpandableLink.vue"
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";

import { RadioButton } from "../../../types/Global";
import {SensitiveInformationDTO} from "@/api/models";
import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import {hasChanges} from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATAlert,
    ATATExpandableLink,
    ATATRadioGroup,
  },
})
export default class Section508Standards extends Mixins(SaveOnLeave) {
  private selected508Response 
    = AcquisitionPackage.sensitiveInformation?.section_508_sufficient || "";

  private section508Options: RadioButton[] = [
    {
      id: "Yes",
      label: "Yes.",
      value: "YES",
    },
    {
      id: "No",
      label: `No. I need to customize the Section 508 Accessibility Standards 
        in my Description of Work.`,
      value: "NO",
    },
  ];

  private get currentData(): SensitiveInformationDTO {
    return {
      section_508_sufficient: this.selected508Response || "",
    };
  }

  private savedData: SensitiveInformationDTO = {
    section_508_sufficient: "",
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
        section_508_sufficient: storeData.section_508_sufficient,
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
  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

}
</script>
