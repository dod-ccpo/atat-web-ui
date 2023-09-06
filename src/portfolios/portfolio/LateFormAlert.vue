<template>
    <ATATAlert
      id="LateFormAlert"
      type="info"
      v-if="showAlertHeading"
    >
      <template v-slot:content>
            <h3 class="mb-1">End of Fiscal Year Cut-off dates</h3>
            <p class="mb-0">
                Requirement packages submitted to DITCO after the below cut-off dates,
                are subject to DITCO’s late-waiver process. This process only applies
                to contracting actions that must be executed by the end of fiscal year
                2023 (e.g., expiring year funds), or not later than Oct. 13, 2023.
            </p>
            <br>
            <p class="mb-0">
                For more information on FY23 cut-off dates and to download a copy of the required
                late-waiver form, visit 
                <a href="https://www.figma.com/exit?url=https%3A%2F%2F
                www.ditco.disa.mil%2FContracts%2FItInstruct"
                 target="_blank">
            DITCO’s Acquisition Package Submission & Ordering Guide  
                </a>
                Required late-waiver form should be submitted and included with your DAPPS package.
                Requirements received after cut-off without the required late-waiver form may be
                returned without action. 
            </p>
        <br>
        <ATATExpandableLink aria-id="LateInfo" :isCopyMaxWidth="false">
            <template v-slot:header>
                View JWCC End of Fiscal Year Cut-off dates
            </template>
            <template v-slot:content>
                <v-row>
                    <v-col class="font-weight-bold mb-0" cols="8">
                        Type of Contracting Action
                    </v-col>
                    <v-col class="font-weight-bold mb-0" cols="4">
                        Cut-off Date
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="8">
                        RFP requiring a technical proposal (awarded on a BVTO basis)
                    </v-col>
                    <v-col cols="4">
                        August 18
                    </v-col>
                </v-row>
                <br>
                <v-row>
                    <v-col cols="8">
                        RFP requiring a technical proposal (awarded on an LPTA basis)
                        and Lump Sum from one Contractor
                    </v-col>
                    <v-col cols="4">
                        August 31
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="8">
                        RFP with no technical proposal (awarded on an LPTA basis) and
                        TOs with Exceptions to Fair Opportunity
                    </v-col>
                    <v-col  cols="4">
                        <p>
                        DISA appropriated funds - August 31 <br>
                        All other funds - September 8
                        </p>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="8">
                        RFP with an equal lump sum dollar amounts awarded to EACH contractor
                    </v-col>
                    <v-col cols="4">
                        DISA appropriated funds - August 31 <br>
                        All other funds - September 8
                    </v-col>
                </v-row>
            
            </template>
      </ATATExpandableLink>
      
    </template>
    </ATATAlert>

  </template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ATATAlert from "@/components/ATATAlert.vue";
import { isBefore, parse } from 'date-fns';
import ATATExpandableLink from "@/components/ATATExpandableLink.vue";
  
  @Component({
    components: {
      ATATAlert,
      ATATExpandableLink
    },
  })
export default class LateFormAlert extends Vue {

  public get showAlertHeading(): boolean {
    const octoberFirst2023 = parse('2023-10-01', 'yyyy-MM-dd', new Date());
    return isBefore(new Date(), octoberFirst2023);
  }
}
  
</script>
