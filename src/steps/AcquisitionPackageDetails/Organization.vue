<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col>
        <h1 class="page-header mb-13">
          Next, we’ll gather information about your organization
        </h1>

        <ATATAutoComplete
          id="ServiceOrAgency"
          class="input-max-width mb-2"
          label="What service or agency do you work for?"
          :label-sr-only="false"
          titleKey="text"
          :searchFields="['text']"
          :items="serviceOrAgencyData"
          :selectedItem.sync="selectedServiceOrAgency"
          placeholder="Find your service/agency"
          icon="arrow_drop_down"
        />

        <a
          role="button"
          class="text-link"
          :class="{ 'mb-10 d-inline-block': !selectedServiceOrAgency}"
          @click="showDialog = true"
        >
          Request to have your agency added
        </a>

        <div v-if="selectedServiceOrAgency" class="mt-10">
          <hr/>
          <section>
            <h2 class="form-section-heading">1. Tell us more about your organization</h2>
            <ATATAutoComplete
              id="DisaOrg"
              v-show="selectedServiceOrAgency.value === 'DISA'"
              class="input-max-width mb-10"
              label="DISA Organization"
              :label-sr-only="false"
              titleKey="text"
              :searchFields="['text']"
              :items="disaOrgData"
              :selectedItem.sync="selectedDisaOrg"
              placeholder="Find your DISA organization"
              icon="arrow_drop_down"
            />

            <ATATTextField
              id="OrgName"
              v-show="selectedServiceOrAgency.value !== 'DISA'"
              label="Organization name"
              class="input-max-width mb-10"
            />

            <ATATTextField
              id="DoDAAC"
              label="DoD Activity Address Code (DoDAAC)"
              class="input-max-width"
              tooltipText="A DoDAAC is a 6-character code that uniquely identifies a unit, activity, or organization that has the authority to requisition, contract for, or fund/pay bills for materials and services."
            />

            <hr/>
          </section>

          <section>
            <h2 class="form-section-heading">2. What is your organization’s address?</h2>

            <ATATRadioGroup
              id="AddressType"
              legend="Type of mailing address"
              :value.sync="selectedAddressType"
              :items="addressTypeOptions"
              name="AddressType"
              class="mt-3 mb-8"
            />

            <v-row>
              <v-col class="col-12 col-lg-7">
                <ATATTextField
                  id="StreetAddress"
                  label="Street address"
                  :class="[{'input-max-width': stackInputs}, 'my-2']"
                />
              </v-col>
              <v-col class="col-12 col-lg-3">
                <ATATTextField
                  id="UnitSuite"
                  label="Unit, suite, etc."
                  :optional="true"
                  :class="[{'input-max-width': stackInputs}, 'my-2']"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col class="col-12 col-lg-4">
                <ATATTextField
                  id="City"
                  label="City"
                  :class="[{'input-max-width': stackInputs}, 'my-2']"
                />
              </v-col>
              <v-col class="col-12 col-lg-3">
                <ATATAutoComplete
                  id="State"
                  label="State"
                  :class="[{'input-max-width': stackInputs}, 'my-2']"
                  :label-sr-only="false"
                  titleKey="text"
                  :searchFields="['text', 'value']"
                  :items="stateListData"
                  :selectedItem.sync="selectedState"
                  placeholder=""
                  icon="arrow_drop_down"
                />
              </v-col>
              <v-col class="col-12 col-lg-3">
                <ATATTextField
                  id="ZIP"
                  label="ZIP code"
                  :class="[{'input-max-width': stackInputs}, 'my-2']"
                />
              </v-col>
            </v-row>
          </section>
        </div>
      </v-col>
    </v-row>
    <ATATDialog
      :showDialog.sync="showDialog"
      title="Request to add your agency"
      persistent
      no-click-animation
      okText="Send Request"
      width="632px"
      disabled="true"
    >
      <template #content>
        <p class="body">
          The agency list is intended to represent activities at the highest level. If you would like to add your
          service or agency, please send us the following information for consideration.
        </p>
        <ATATTextField
          id="Agency/Organization Name"
          label="Agency/Organization Name"
          :class="[{'input-max-width': stackInputs}, 'my-2 pb-16 mb-9']"
        />
      </template>
    </ATATDialog>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {Component} from "vue-property-decorator";
import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import ATATRadioGroup from "../../components/ATATRadioGroup.vue"
import ATATTextField from "../../components/ATATTextField.vue";
import {SelectData} from "../../../types/Global";
import ATATDialog from "@/components/ATATDialog.vue";
import {RadioButton} from "types/Global";

@Component({
  components: {
    ATATAutoComplete,
    ATATTextField,
    ATATRadioGroup,
    ATATDialog,
  }
})

export default class OrganizationInfo extends Vue {
  get stackInputs(): boolean {
    console.log(this.$vuetify.breakpoint.mdAndDown)
    return this.$vuetify.breakpoint.mdAndDown;
  }

  private selectedAddressType = "USA";
  private showDialog = false;

  private addressTypeOptions: RadioButton[] = [
    {
      id: "USAddress",
      label: "U.S. address",
      value: "USA",
    },
    {
      id: "MilitaryAddress",
      label: "Military",
      value: "MIL",
      disabled: true,
    },
    {
      id: "ForeignAddress",
      label: "Foreign address",
      value: "FOR",
      disabled: true,
    },
  ];

  private selectedDisaOrg = "";
  private disaOrgData: SelectData[] = [
    {text: 'Assistant to the Director (DD)', value: 'DD',},
    {text: 'Chaplain Program Management Office (DDCH)', value: 'DDCH',},
    {text: 'Chief Financial Officer / Comptroller (CP)', value: 'CP',},
    {text: 'Chief of Staff (DDC)', value: 'DDC',},
    {text: 'Combined Action Group (DDCG)', value: 'DDCG',},
    {text: 'Component Acquisition Executive (CAE)', value: 'CAE',},
    {text: 'DCSC Cyber Security & Analytics (ID)', value: 'ID',},
    {text: 'DCSC Defense Spectrum Organization (DSO)', value: 'DSO',},
    {text: 'DCSC Joint Enterprise Services (SD)', value: 'SD',},
    {text: 'DCSC Joint Enterprise Services DoD Enterprise Mobility (SD5)', value: 'SD5',},
    {text: 'DCSC Joint Interop Test Command (JITC)', value: 'JITC',},
    {text: 'DCSC National Background Investigative System Directorate (NBIS)', value: 'NBIS',},
    {text: 'DCSC Resource Management (BD)', value: 'BD',},
    {text: 'DISA Director Group (DD)', value: 'DD',},
    {text: 'EC Chief Data Officer (OD)', value: 'OD',},
    {text: 'EC Chief Information Officer (IO)', value: 'IO',},
    {text: 'EC Emerging Technology (EM)', value: 'EM',},
    {text: 'EC Enterprise Engineering & Governance (OE)', value: 'OE',},
    {text: 'EC Resource Management (EC)', value: 'EC',},
    {text: 'EC Rick Management (RE)', value: 'RE',},
    {text: 'Executive Deputy Director (DDE)', value: 'DDE',},
    {text: 'General Counsel (GC)', value: 'GC',},
    {text: 'HC Compute Operations Office (HC3)', value: 'HC3',},
    {text: 'HC Product Management Office (HC2)', value: 'HC2',},
    {text: 'HC Operations Support Office (HC1)', value: 'HC1',},
    {text: 'Inspector General (IG)', value: 'IG',},
    {text: 'Joint Artificial Intelligence Center (JAIC)', value: 'JAIC',},
    {text: 'Joint Forces Headquarters (JFHQ)', value: 'JFHQ',},
    {text: 'Joint Support Group (JSG)', value: 'JSG',},
    {text: 'Joint Services Provider (JSP)', value: 'JSP',},
    {text: 'OC Cyberspace-Operations (CE)', value: 'CE',},
    {text: 'OC Cyberspace-Operations Joint Staff Support Center (JC)', value: 'JC',},
    {text: 'OC Cyberspace-Operations DISA Pacific (PC)', value: 'PC',},
    {text: 'OC Endpoint Services & Customer Support (FE)', value: 'FE',},
    {text: 'OC Transport Services (IE)', value: 'IE',},
    {text: 'OC Resource Management (OC)', value: 'OC',},
    {text: 'Office of Equality, Diversity & Inclusion (OEDI)', value: 'OEDI',},
    {text: 'Office of Strategic Communications & Public Affairs (DDCP)', value: 'DDCP',},
    {text: 'Pentagon Liaison Officer / Congressional Affairs Coordinator (DDC)', value: 'DDC',},
    {text: 'Procurement Services (PSD)', value: 'PSD',},
    {text: 'Procurement Services DITCO EUR (PL5)', value: 'PL5',},
    {text: 'Procurement Services DITCO EUR (PL6)', value: 'PL6',},
    {text: 'Procurement Services DITCO PAC (PL7)', value: 'PL7',},
    {text: 'Procurement Services DITCO Scott (PL8)', value: 'PL8',},
    {
      text: 'Program Director for Culture & Employee Engagement',
      value: 'Program Director for Culture & Employee Engagement',
    },
    {text: 'Protocol (DDCA)', value: 'DDCA',},
    {
      text: 'Secretary of Defense Communications',
      value: 'Secretary of Defense Communications',
    },
    {text: 'Senior Enlisted Advisor (DDS)', value: 'DDS',},
    {text: 'Small Business Programs (DDC4)', value: 'DDC4',},
    {text: 'White House Communications Agency (WHCA)', value: 'WHCA',},
    {text: 'White House Situation Support Staff (WHSSS)', value: 'WHSSS ',},
    {text: 'Workforce Services and Development Directorate (WSD)', value: 'WSD',},
  ];

  private selectedServiceOrAgency = "";
  private serviceOrAgencyData: SelectData[] = [
    {text: 'Communications & Electronics Command', value: 'Communications & Electronics Command',},
    {text: 'Defense Advanced Research Project Agency (DARPA) **', value: 'DARPA',},
    {text: 'Defense Commissary Agency', value: 'Defense Commissary Agency',},
    {text: 'Defense Contract Audit Agency (DCAA) **', value: 'DCAA',},
    {text: 'Defense Contract Management Agency (DCMA) **', value: 'DCMA',},
    {
      text: 'Defense Counterintelligence and Security Agency',
      value: 'Defense Counterintelligence and Security Agency',
    },
    {text: 'Defense Criminal Investigation Service', value: 'Defense Criminal Investigation Service',},
    {text: 'Defense Finance and Accounting Service', value: 'Defense Finance and Accounting Service',},
    {text: 'Defense Information Systems Agency (DISA) **', value: 'DISA',},
    {text: 'Defense Intelligence Agency (DIA)', value: 'DIA',},
    {text: 'Defense Logistics Agency (DLA) **', value: 'DLA',},
    {text: 'Defense Media Activity (DMA) **', value: 'DMA',},
    {text: 'Defense Security Cooperation Agency', value: 'Defense Security Cooperation Agency',},
    {text: 'Defense Technical Information Center', value: 'Defense Technical Information Center',},
    {text: 'Defense Threat Reduction Center (DTRA) **', value: 'DTRA',},
    {text: 'Department of Defense', value: 'Department of Defense',},
    {text: 'Joint Chiefs of Staff', value: 'Joint Chiefs of Staff',},
    {text: 'Joint Forces Command', value: 'Joint Forces Command',},
    {text: 'Joint Informaiton Operations Warfare Command', value: 'Joint Informaiton Operations Warfare Command',},
    {text: 'Joint Logistics Systems Center', value: 'Joint Logistics Systems Center',},
    {text: 'Joint Staff Comptroller', value: 'Joint Staff Comptroller',},
    {text: 'Joint System Engineering & Integration Office (JSEIO)', value: 'JSEIO',},
    {text: 'Military Health System (MHS)', value: 'MHS ',},
    {text: 'Defense Health Agency (DHA) **', value: 'DHA',},
    {text: 'Military Sealift Command', value: 'National Geospatial Intelligence Agency',},
    {text: 'National Geospatial Intelligence Agency', value: 'National Ground Intelligence Agency',},
    {text: 'National Ground Intelligence Agency', value: 'National Guard Bureau',},
    {text: 'National Guard Bureau', value: 'National Security Agency',},
    {text: 'National Security Agency', value: 'Office of the Secretary of Defense (OSD)',},
    {text: 'Office of the Secretary of Defense (OSD)', value: 'OSD',},
    {text: 'U.S. Africa Command', value: 'U.S. Air Force',},
    {text: 'U.S. Air Force', value: 'U.S. Air Force Europe (USAFE)',},
    {text: 'U.S. Air Force Europe (USAFE)', value: 'USAFE',},
    {text: 'U.S. Army', value: 'U.S. Central Command (USCENTCOM)',},
    {text: 'U.S. Central Command (USCENTCOM)', value: 'USCENTCOM',},
    {text: 'U.S. Coast Guard', value: 'U.S. Cyber Command',},
    {text: 'U.S. Cyber Command', value: 'U.S. European Command (USEUCOM)',},
    {text: 'U.S. European Command (USEUCOM)', value: 'USEUCOM',},
    {text: 'U.S. Marine Corps', value: 'U.S. Navy',},
    {text: 'U.S. Navy', value: 'U.S. Northern Command (USNORTHCOM)',},
    {text: 'U.S. Northern Command (USNORTHCOM)', value: 'USNORTHCOM',},
    {text: 'U.S. Pacific Command (USPACCOM)', value: 'USPACCOM',},
    {text: 'U.S. Southern Command (USSOUTHCOM)', value: 'USSOUTHCOM',},
    {text: 'U.S. Special Operations Command (USSOCCOM)', value: 'USSOCCOM',},
    {text: 'U.S. Strategic Command (USSTRATCOM)', value: 'USSTRATCOM',},
    {text: 'U.S. Transportation Command (USTRANSCOM)', value: 'USTRANSCOM',},
  ];

  private selectedState = "";
  private stateListData: SelectData[] = [
    {text: 'Alabama', value: 'AL'},
    {text: 'Alaska', value: 'AK'},
    {text: 'Arizona', value: 'AZ'},
    {text: 'Arkansas', value: 'AR'},
    {text: 'California', value: 'CA'},
    {text: 'Colorado', value: 'CO'},
    {text: 'Connecticut', value: 'CT'},
    {text: 'Delaware', value: 'DE'},
    {text: 'District of Columbia', value: 'DC'},
    {text: 'Florida', value: 'FL'},
    {text: 'Georgia', value: 'GA'},
    {text: 'Hawaii', value: 'HI'},
    {text: 'Idaho', value: 'ID'},
    {text: 'Illinois', value: 'IL'},
    {text: 'Indiana', value: 'IN'},
    {text: 'Iowa', value: 'IA'},
    {text: 'Kansas', value: 'KS'},
    {text: 'Kentucky', value: 'KY'},
    {text: 'Louisiana', value: 'LA'},
    {text: 'Maine', value: 'ME'},
    {text: 'Maryland', value: 'MD'},
    {text: 'Massachusetts', value: 'MA'},
    {text: 'Michigan', value: 'MI'},
    {text: 'Minnesota', value: 'MN'},
    {text: 'Mississippi', value: 'MS'},
    {text: 'Missouri', value: 'MO'},
    {text: 'Montana', value: 'MT'},
    {text: 'Nebraska', value: 'NE'},
    {text: 'Nevada', value: 'NV'},
    {text: 'New Hampshire', value: 'NH'},
    {text: 'New Jersey', value: 'NJ'},
    {text: 'New Mexico', value: 'NM'},
    {text: 'New York', value: 'NY'},
    {text: 'North Carolina', value: 'NC'},
    {text: 'North Dakota', value: 'ND'},
    {text: 'Ohio', value: 'OH'},
    {text: 'Oklahoma', value: 'OK'},
    {text: 'Oregon', value: 'OR'},
    {text: 'Pennsylvania', value: 'PA'},
    {text: 'Rhode Island', value: 'RI'},
    {text: 'South Carolina', value: 'SC'},
    {text: 'South Dakota', value: 'SD'},
    {text: 'Tennessee', value: 'TN'},
    {text: 'Texas', value: 'TX'},
    {text: 'Utah', value: 'UT'},
    {text: 'Vermont', value: 'VT'},
    {text: 'Virginia', value: 'VA'},
    {text: 'Washington', value: 'WA'},
    {text: 'West Virginia', value: 'WV'},
    {text: 'Wisconsin', value: 'WI'},
    {text: 'Wyoming', value: 'WY'},
  ]
}

</script>
