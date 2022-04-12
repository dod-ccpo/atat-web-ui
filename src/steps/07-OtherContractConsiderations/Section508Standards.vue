<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Let’s look into your Section 508 Accessibility requirements
          </h1>
          <div class="copy-max-width">
            <p>
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
                <h3 class="mb-3">Electronic Content Technical Criteria:</h3>
                <ul class="_atat-ul">
                  <li>
                    <span class="_semibold">E205.1 General</span> - Electronic
                    content shall comply with E205.
                  </li>
                  <li>
                    <span class="_semibold">E205.2 Public Facing</span> -
                    Electronic content that is public facing shall conform to
                    the accessibility requirements specified in E205.4.
                  </li>
                  <li>
                    <span class="_semibold">602 Support Documentation</span>
                  </li>
                  <li>
                    <span class="_semibold">603 Support Services</span>
                  </li>
                  <li>
                    <span class="_semibold"
                      >302 Functional Performance Criteria</span
                    >
                  </li>
                </ul>

                <span class="font-size-16 _semibold mb-3">Software Exceptions:</span>
                <ul class="_atat-ul">
                  <li>
                    <span class="_semibold">E207.1 General</span> - Software
                    that is assistive technology and that supports the
                    accessibility services of the platform shall not be required
                    to conform to the requirements in Chapter 5.
                  </li>
                  <li>
                    <span class="_semibold">E207.2 WCAG Conformance -</span>
                  </li>

                  <li>
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
                      <li>
                        Non-Web software shall not be required to conform to
                        Conformance Requirement 3 Complete Processes in WCAG
                        2.0.
                      </li>
                    </ul>
                  </li>
                </ul>

                <h3 class="mb-3">Functional Performance Criteria:</h3>
                <ul class="_atat-ul">
                  <li>
                    <span class="_semibold">301.1 Scope</span> - The
                    requirements of Chapter 3 shall apply to ICT where required
                    by 508 Chapter 2 (Scoping Requirements), 255 Chapter 2
                    (Scoping Requirements), and where otherwise referenced in
                    any other chapter of the Revised 508 Standards or Revised
                    255 Guidelines.
                  </li>
                  <li>
                    <span class="_semibold">302.1 Without Vision</span> - Where
                    a visual mode of operation is provided, ICT shall provide at
                    least one mode of operation that does not require user
                    vision.
                  </li>
                  <li>
                    <span class="_semibold">302.2 With Limited Vision</span> -
                    Where a visual mode of operation is provided, ICT shall
                    provide at least one mode of operation that enables users to
                    make use of limited vision.
                  </li>
                  <li>
                    <span class="_semibold">302.3 Without Perception of Color</span> 
                    - Where a visual mode of operation is provided, ICT shall
                    provide at least one visual mode of operation that does not
                    require user perception of color.
                  </li>
                  <li>
                    <span class="_semibold">302.4 Without Hearing</span> - Where
                    an audible mode of operation is provided, ICT shall provide
                    at least one mode of operation that does not require user
                    hearing.
                  </li>
                  <li>
                    <span class="_semibold">302.5 With Limited Hearing</span> -
                    Where an audible mode of operation is provided, ICT shall
                    provide at least one mode of operation that enables users to
                    make use of limited hearing.
                  </li>
                  <li>
                    <span class="_semibold">302.6 Without Speech</span> - Where
                    speech is used for input, control, or operation, ICT shall
                    provide at least one mode of operation that does not require
                    user speech.
                  </li>
                  <li>
                    <span class="_semibold">302.7 With Limited Manipulation</span>
                    - Where a manual mode of operation is provided, ICT shall
                    provide at least one mode of operation that does not require
                    fine motor control or simultaneous manual operations.
                  </li>
                  <li>
                    <span class="_semibold">302.8 With Limited Reach and Strength</span>
                    - Where a manual mode of operation is provided, ICT shall
                    provide at least one mode of operation that is operable with
                    limited reach and limited strength.
                  </li>
                  <li>
                    <span class="_semibold">302.9 With Limited Language, Cognitive, 
                    and Learning Abilities</span> - ICT shall provide features 
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
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATAlert from "@/components/ATATAlert.vue";
import ATATExpandableLink from "@/components/ATATExpandableLink.vue"
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";

import { RadioButton } from "../../../types/Global";

@Component({
  components: {
    ATATAlert,
    ATATExpandableLink,
    ATATRadioGroup,
  },
})
export default class Section508Standards extends Vue {
  private selected508Response = "";
  private section508Options: RadioButton[] = [
    {
      id: "Yes",
      label: "Yes.",
      value: "true",
    },
    {
      id: "No",
      label: `No. I need to customize the Section 508 Accessibility Standards 
        in my Description of Work.`,
      value: "false",
    },
  ];
}
</script>
