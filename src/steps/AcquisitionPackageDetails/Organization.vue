<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col>
        <h1 class="page-header">
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
          id="RequestAgencyAdded"
          class="text-link"
          :class="{ 'mb-10 d-inline-block': !selectedServiceOrAgency}"
          @click="showDialog = true"
        >
          Request to have your agency added
        </a>

        <div v-show="selectedServiceOrAgency" class="mt-10">
          <hr/>
          <section id="Section1">
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

          <section id="Section2">
            <h2 class="form-section-heading">2. What is your organization’s address?</h2>

            <ATATRadioGroup
              id="AddressType"
              legend="Type of mailing address"
              :value.sync="selectedAddressType"
              :items="addressTypeOptions"
              name="AddressType"
              class="mt-3 mb-8"
              @radioButtonSelected="addressTypeChange"
            />

            <v-row>
              <v-col class="col-12 col-lg-8">
                <ATATTextField
                  id="StreetAddress"
                  label="Street address"
                  :class="inputClass"
                />
              </v-col>
              <v-col class="col-12 col-lg-3">
                <ATATTextField
                  id="UnitSuite"
                  label="Unit, suite, etc."
                  :optional="true"
                  :class="inputClass"
                  width="160px"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col 
                class="col-12"
                :class="[selectedAddressType !== 'FOR' ? 'col-lg-5' : 'col-lg-4']"
              >
                <ATATTextField
                  v-show="selectedAddressType !== 'MIL'"
                  id="City"
                  label="City"
                  :class="inputClass"
                />
                <ATATSelect
                  v-show="selectedAddressType === 'MIL'"
                  id="APO_FPO"
                  label="APO/FPO"
                  :class="inputClass"
                  :items="militaryPostOfficeOptions"
                  :value.sync="selectedMilitaryPO"
                />
              </v-col>
              <v-col 
                class="col-12"
                :class="[selectedAddressType !== 'FOR' ? 'col-lg-3' : 'col-lg-4']"
              >
                <ATATAutoComplete
                  id="State"
                  label="State"
                  v-show="selectedAddressType === 'USA'"
                  :class="inputClass"
                  titleKey="text"
                  :searchFields="['text', 'value']"
                  :items="stateListData"
                  :selectedItem.sync="selectedState"
                  placeholder=""
                  icon="arrow_drop_down"
                />

                <ATATSelect
                  v-show="selectedAddressType === 'MIL'"
                  id="StateCode"
                  label="State code"
                  :class="inputClass"
                  :items="stateCodeListData"
                  :selectedValue.sync="selectedStateCode"
                />

                <ATATTextField
                  v-show="selectedAddressType === 'FOR'"
                  id="StateProvince"
                  label="State or Province"
                  :class="inputClass"
                />
              </v-col>
              <v-col class="col-12 col-lg-3">
                <ATATTextField
                  id="ZIP"
                  :label="zipLabel"
                  :class="inputClass"
                  width="160px"
                />
              </v-col>
            </v-row>
            <v-row v-show="selectedAddressType === 'FOR'">
              <v-col class="col-12 col-lg-4">
                <ATATAutoComplete
                  id="Country"
                  label="Country"
                  :class="inputClass"
                  titleKey="text"
                  :searchFields="['text', 'value']"
                  :items="countryListData"
                  :selectedItem.sync="selectedCountry"
                  placeholder=""
                  icon="arrow_drop_down"
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
      :disabled="true"
    >
      <template #content>
        <p class="body">
          The agency list is intended to represent activities at the highest level. If you would like to add your
          service or agency, please send us the following information for consideration.
        </p>
        <ATATTextField
          id="AgencyOrgName"
          label="Agency/Organization Name"
          :class="[inputClass, 'pb-16 mb-9']"
        />
      </template>
    </ATATDialog>

  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import ATATDialog from "@/components/ATATDialog.vue";
import ATATRadioGroup from "../../components/ATATRadioGroup.vue"
import ATATSelect from "../../components/ATATSelect.vue";
import ATATTextField from "../../components/ATATTextField.vue";

import { RadioButton, SelectData } from "types/Global";

@Component({
  components: {
    ATATAutoComplete,
    ATATDialog,
    ATATRadioGroup,
    ATATSelect,
    ATATTextField,
  }
})

export default class OrganizationInfo extends Vue {
  
  // computed
  get inputClass(): string {
    return this.$vuetify.breakpoint.mdAndDown ? "input-max-width my-2" : "my-2";
  }

  get zipLabel(): string {
    return this.selectedAddressType !== "FOR" ? "ZIP code" : "Postal Code";
  }

  // data
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
    },
    {
      id: "ForeignAddress",
      label: "Foreign address",
      value: "FOR",
    },
  ];

  private selectedMilitaryPO = "";
  private militaryPostOfficeOptions: SelectData[] = [
    { text: "Army Post Office (APO)", value: "APO" },
    { text: "Fleet Post Office (FPO)", value: "FPO" },
  ];

  private selectedDisaOrg = "";
  private disaOrgData: SelectData[] = [
    { text: 'Assistant to the Director (DD)', value: 'DD',},
    { text: 'Chaplain Program Management Office (DDCH)', value: 'DDCH',},
    { text: 'Chief Financial Officer / Comptroller (CP)', value: 'CP',},
    { text: 'Chief of Staff (DDC)', value: 'DDC',},
    { text: 'Combined Action Group (DDCG)', value: 'DDCG',},
    { text: 'Component Acquisition Executive (CAE)', value: 'CAE',},
    { text: 'DCSC Cyber Security & Analytics (ID)', value: 'ID',},
    { text: 'DCSC Defense Spectrum Organization (DSO)', value: 'DSO',},
    { text: 'DCSC Joint Enterprise Services (SD)', value: 'SD',},
    { text: 'DCSC Joint Enterprise Services DoD Enterprise Mobility (SD5)', value: 'SD5',},
    { text: 'DCSC Joint Interop Test Command (JITC)', value: 'JITC',},
    { text: 'DCSC National Background Investigative System Directorate (NBIS)', value: 'NBIS',},
    { text: 'DCSC Resource Management (BD)', value: 'BD',},
    { text: 'DISA Director Group (DD)', value: 'DD',},
    { text: 'EC Chief Data Officer (OD)', value: 'OD',},
    { text: 'EC Chief Information Officer (IO)', value: 'IO',},
    { text: 'EC Emerging Technology (EM)', value: 'EM',},
    { text: 'EC Enterprise Engineering & Governance (OE)', value: 'OE',},
    { text: 'EC Resource Management (EC)', value: 'EC',},
    { text: 'EC Rick Management (RE)', value: 'RE',},
    { text: 'Executive Deputy Director (DDE)', value: 'DDE',},
    { text: 'General Counsel (GC)', value: 'GC',},
    { text: 'HC Compute Operations Office (HC3)', value: 'HC3',},
    { text: 'HC Product Management Office (HC2)', value: 'HC2',},
    { text: 'HC Operations Support Office (HC1)', value: 'HC1',},
    { text: 'Inspector General (IG)', value: 'IG',},
    { text: 'Joint Artificial Intelligence Center (JAIC)', value: 'JAIC',},
    { text: 'Joint Forces Headquarters (JFHQ)', value: 'JFHQ',},
    { text: 'Joint Support Group (JSG)', value: 'JSG',},
    { text: 'Joint Services Provider (JSP)', value: 'JSP',},
    { text: 'OC Cyberspace-Operations (CE)', value: 'CE',},
    { text: 'OC Cyberspace-Operations Joint Staff Support Center (JC)', value: 'JC',},
    { text: 'OC Cyberspace-Operations DISA Pacific (PC)', value: 'PC',},
    { text: 'OC Endpoint Services & Customer Support (FE)', value: 'FE',},
    { text: 'OC Transport Services (IE)', value: 'IE',},
    { text: 'OC Resource Management (OC)', value: 'OC',},
    { text: 'Office of Equality, Diversity & Inclusion (OEDI)', value: 'OEDI',},
    { text: 'Office of Strategic Communications & Public Affairs (DDCP)', value: 'DDCP',},
    { text: 'Pentagon Liaison Officer / Congressional Affairs Coordinator (DDC)', value: 'DDC',},
    { text: 'Procurement Services (PSD)', value: 'PSD',},
    { text: 'Procurement Services DITCO EUR (PL5)', value: 'PL5',},
    { text: 'Procurement Services DITCO EUR (PL6)', value: 'PL6',},
    { text: 'Procurement Services DITCO PAC (PL7)', value: 'PL7',},
    { text: 'Procurement Services DITCO Scott (PL8)', value: 'PL8',},
    {
      text: 'Program Director for Culture & Employee Engagement',
      value: 'Program Director for Culture & Employee Engagement',
    },
    { text: 'Protocol (DDCA)', value: 'DDCA',},
    {
      text: 'Secretary of Defense Communications',
      value: 'Secretary of Defense Communications',
    },
    { text: 'Senior Enlisted Advisor (DDS)', value: 'DDS',},
    { text: 'Small Business Programs (DDC4)', value: 'DDC4',},
    { text: 'White House Communications Agency (WHCA)', value: 'WHCA',},
    { text: 'White House Situation Support Staff (WHSSS)', value: 'WHSSS ',},
    { text: 'Workforce Services and Development Directorate (WSD)', value: 'WSD',},
  ];

  private selectedServiceOrAgency = "";
  private serviceOrAgencyData: SelectData[] = [
    { text: 'Communications & Electronics Command', value: 'Communications & Electronics Command',},
    { text: 'Defense Advanced Research Project Agency (DARPA)', value: 'DARPA',},
    { text: 'Defense Commissary Agency', value: 'Defense Commissary Agency',},
    { text: 'Defense Contract Audit Agency (DCAA)', value: 'DCAA',},
    { text: 'Defense Contract Management Agency (DCMA)', value: 'DCMA',},
    {
      text: 'Defense Counterintelligence and Security Agency',
      value: 'Defense Counterintelligence and Security Agency',
    },
    { text: 'Defense Criminal Investigation Service', value: 'Defense Criminal Investigation Service',},
    { text: 'Defense Finance and Accounting Service', value: 'Defense Finance and Accounting Service',},
    { text: 'Defense Information Systems Agency (DISA)', value: 'DISA',},
    { text: 'Defense Intelligence Agency (DIA)', value: 'DIA',},
    { text: 'Defense Logistics Agency (DLA)', value: 'DLA',},
    { text: 'Defense Media Activity (DMA)', value: 'DMA',},
    { text: 'Defense Security Cooperation Agency', value: 'Defense Security Cooperation Agency',},
    { text: 'Defense Technical Information Center', value: 'Defense Technical Information Center',},
    { text: 'Defense Threat Reduction Center (DTRA)', value: 'DTRA',},
    { text: 'Department of Defense', value: 'Department of Defense',},
    { text: 'Joint Chiefs of Staff', value: 'Joint Chiefs of Staff',},
    { text: 'Joint Forces Command', value: 'Joint Forces Command',},
    { text: 'Joint Informaiton Operations Warfare Command', value: 'Joint Informaiton Operations Warfare Command',},
    { text: 'Joint Logistics Systems Center', value: 'Joint Logistics Systems Center',},
    { text: 'Joint Staff Comptroller', value: 'Joint Staff Comptroller',},
    { text: 'Joint System Engineering & Integration Office (JSEIO)', value: 'JSEIO',},
    { text: 'Military Health System (MHS)', value: 'MHS ',},
    { text: 'Defense Health Agency (DHA)', value: 'DHA',},
    { text: 'Military Sealift Command', value: 'National Geospatial Intelligence Agency',},
    { text: 'National Geospatial Intelligence Agency', value: 'National Ground Intelligence Agency',},
    { text: 'National Ground Intelligence Agency', value: 'National Guard Bureau',},
    { text: 'National Guard Bureau', value: 'National Security Agency',},
    { text: 'National Security Agency', value: 'Office of the Secretary of Defense (OSD)',},
    { text: 'Office of the Secretary of Defense (OSD)', value: 'OSD',},
    { text: 'U.S. Africa Command', value: 'U.S. Air Force',},
    { text: 'U.S. Air Force', value: 'U.S. Air Force Europe (USAFE)',},
    { text: 'U.S. Air Force Europe (USAFE)', value: 'USAFE',},
    { text: 'U.S. Army', value: 'U.S. Central Command (USCENTCOM)',},
    { text: 'U.S. Central Command (USCENTCOM)', value: 'USCENTCOM',},
    { text: 'U.S. Coast Guard', value: 'U.S. Cyber Command',},
    { text: 'U.S. Cyber Command', value: 'U.S. European Command (USEUCOM)',},
    { text: 'U.S. European Command (USEUCOM)', value: 'USEUCOM',},
    { text: 'U.S. Marine Corps', value: 'U.S. Navy',},
    { text: 'U.S. Navy', value: 'U.S. Northern Command (USNORTHCOM)',},
    { text: 'U.S. Northern Command (USNORTHCOM)', value: 'USNORTHCOM',},
    { text: 'U.S. Pacific Command (USPACCOM)', value: 'USPACCOM',},
    { text: 'U.S. Southern Command (USSOUTHCOM)', value: 'USSOUTHCOM',},
    { text: 'U.S. Special Operations Command (USSOCCOM)', value: 'USSOCCOM',},
    { text: 'U.S. Strategic Command (USSTRATCOM)', value: 'USSTRATCOM',},
    { text: 'U.S. Transportation Command (USTRANSCOM)', value: 'USTRANSCOM',},
  ];

  private selectedStateCode = "";
  private stateCodeListData: SelectData[] = [
    { text: "AA - Armed Forces Americas", value: "AA" },
    { text: "AE - Armed Forces Europe", value: "AE" },
    { text: "AP - Armed Forces Pacific", value: "AP" },
  ];

  private selectedState = "";
  private stateListData: SelectData[] = [
    { text: 'Alabama', value: 'AL' },
    { text: 'Alaska', value: 'AK' },
    { text: 'Arizona', value: 'AZ' },
    { text: 'Arkansas', value: 'AR' },
    { text: 'California', value: 'CA' },
    { text: 'Colorado', value: 'CO' },
    { text: 'Connecticut', value: 'CT' },
    { text: 'Delaware', value: 'DE' },
    { text: 'District of Columbia', value: 'DC' },
    { text: 'Florida', value: 'FL' },
    { text: 'Georgia', value: 'GA' },
    { text: 'Hawaii', value: 'HI' },
    { text: 'Idaho', value: 'ID' },
    { text: 'Illinois', value: 'IL' },
    { text: 'Indiana', value: 'IN' },
    { text: 'Iowa', value: 'IA' },
    { text: 'Kansas', value: 'KS' },
    { text: 'Kentucky', value: 'KY' },
    { text: 'Louisiana', value: 'LA' },
    { text: 'Maine', value: 'ME' },
    { text: 'Maryland', value: 'MD' },
    { text: 'Massachusetts', value: 'MA' },
    { text: 'Michigan', value: 'MI' },
    { text: 'Minnesota', value: 'MN' },
    { text: 'Mississippi', value: 'MS' },
    { text: 'Missouri', value: 'MO' },
    { text: 'Montana', value: 'MT' },
    { text: 'Nebraska', value: 'NE' },
    { text: 'Nevada', value: 'NV' },
    { text: 'New Hampshire', value: 'NH' },
    { text: 'New Jersey', value: 'NJ' },
    { text: 'New Mexico', value: 'NM' },
    { text: 'New York', value: 'NY' },
    { text: 'North Carolina', value: 'NC' },
    { text: 'North Dakota', value: 'ND' },
    { text: 'Ohio', value: 'OH' },
    { text: 'Oklahoma', value: 'OK' },
    { text: 'Oregon', value: 'OR' },
    { text: 'Pennsylvania', value: 'PA' },
    { text: 'Rhode Island', value: 'RI' },
    { text: 'South Carolina', value: 'SC' },
    { text: 'South Dakota', value: 'SD' },
    { text: 'Tennessee', value: 'TN' },
    { text: 'Texas', value: 'TX' },
    { text: 'Utah', value: 'UT' },
    { text: 'Vermont', value: 'VT' },
    { text: 'Virginia', value: 'VA' },
    { text: 'Washington', value: 'WA' },
    { text: 'West Virginia', value: 'WV' },
    { text: 'Wisconsin', value: 'WI' },
    { text: 'Wyoming', value: 'WY' },
  ];

  private selectedCountry = "USA";
  private countryListData = [ 
    { text: 'Afghanistan', value: 'AF' }, 
    { text: 'Åland Islands', value: 'AX' }, 
    { text: 'Albania', value: 'AL' }, 
    { text: 'Algeria', value: 'DZ' }, 
    { text: 'American Samoa', value: 'AS' }, 
    { text: 'AndorrA', value: 'AD' }, 
    { text: 'Angola', value: 'AO' }, 
    { text: 'Anguilla', value: 'AI' }, 
    { text: 'Antarctica', value: 'AQ' }, 
    { text: 'Antigua and Barbuda', value: 'AG' }, 
    { text: 'Argentina', value: 'AR' }, 
    { text: 'Armenia', value: 'AM' }, 
    { text: 'Aruba', value: 'AW' }, 
    { text: 'Australia', value: 'AU' }, 
    { text: 'Austria', value: 'AT' }, 
    { text: 'Azerbaijan', value: 'AZ' }, 
    { text: 'Bahamas', value: 'BS' }, 
    { text: 'Bahrain', value: 'BH' }, 
    { text: 'Bangladesh', value: 'BD' }, 
    { text: 'Barbados', value: 'BB' }, 
    { text: 'Belarus', value: 'BY' }, 
    { text: 'Belgium', value: 'BE' }, 
    { text: 'Belize', value: 'BZ' }, 
    { text: 'Benin', value: 'BJ' }, 
    { text: 'Bermuda', value: 'BM' }, 
    { text: 'Bhutan', value: 'BT' }, 
    { text: 'Bolivia', value: 'BO' }, 
    { text: 'Bosnia and Herzegovina', value: 'BA' }, 
    { text: 'Botswana', value: 'BW' }, 
    { text: 'Bouvet Island', value: 'BV' }, 
    { text: 'Brazil', value: 'BR' }, 
    { text: 'British Indian Ocean Territory', value: 'IO' }, 
    { text: 'Brunei Darussalam', value: 'BN' }, 
    { text: 'Bulgaria', value: 'BG' }, 
    { text: 'Burkina Faso', value: 'BF' }, 
    { text: 'Burundi', value: 'BI' }, 
    { text: 'Cambodia', value: 'KH' }, 
    { text: 'Cameroon', value: 'CM' }, 
    { text: 'Canada', value: 'CA' }, 
    { text: 'Cape Verde', value: 'CV' }, 
    { text: 'Cayman Islands', value: 'KY' }, 
    { text: 'Central African Republic', value: 'CF' }, 
    { text: 'Chad', value: 'TD' }, 
    { text: 'Chile', value: 'CL' }, 
    { text: 'China', value: 'CN' }, 
    { text: 'Christmas Island', value: 'CX' }, 
    { text: 'Cocos (Keeling) Islands', value: 'CC' }, 
    { text: 'Colombia', value: 'CO' }, 
    { text: 'Comoros', value: 'KM' }, 
    { text: 'Congo', value: 'CG' }, 
    { text: 'Congo, The Democratic Republic of the', value: 'CD' }, 
    { text: 'Cook Islands', value: 'CK' }, 
    { text: 'Costa Rica', value: 'CR' }, 
    { text: 'Cote D\'Ivoire', value: 'CI' }, 
    { text: 'Croatia', value: 'HR' }, 
    { text: 'Cuba', value: 'CU' }, 
    { text: 'Cyprus', value: 'CY' }, 
    { text: 'Czech Republic', value: 'CZ' }, 
    { text: 'Denmark', value: 'DK' }, 
    { text: 'Djibouti', value: 'DJ' }, 
    { text: 'Dominica', value: 'DM' }, 
    { text: 'Dominican Republic', value: 'DO' }, 
    { text: 'Ecuador', value: 'EC' }, 
    { text: 'Egypt', value: 'EG' }, 
    { text: 'El Salvador', value: 'SV' }, 
    { text: 'Equatorial Guinea', value: 'GQ' }, 
    { text: 'Eritrea', value: 'ER' }, 
    { text: 'Estonia', value: 'EE' }, 
    { text: 'Ethiopia', value: 'ET' }, 
    { text: 'Falkland Islands (Malvinas)', value: 'FK' }, 
    { text: 'Faroe Islands', value: 'FO' }, 
    { text: 'Fiji', value: 'FJ' }, 
    { text: 'Finland', value: 'FI' }, 
    { text: 'France', value: 'FR' }, 
    { text: 'French Guiana', value: 'GF' }, 
    { text: 'French Polynesia', value: 'PF' }, 
    { text: 'French Southern Territories', value: 'TF' }, 
    { text: 'Gabon', value: 'GA' }, 
    { text: 'Gambia', value: 'GM' }, 
    { text: 'Georgia', value: 'GE' }, 
    { text: 'Germany', value: 'DE' }, 
    { text: 'Ghana', value: 'GH' }, 
    { text: 'Gibraltar', value: 'GI' }, 
    { text: 'Greece', value: 'GR' }, 
    { text: 'Greenland', value: 'GL' }, 
    { text: 'Grenada', value: 'GD' }, 
    { text: 'Guadeloupe', value: 'GP' }, 
    { text: 'Guam', value: 'GU' }, 
    { text: 'Guatemala', value: 'GT' }, 
    { text: 'Guernsey', value: 'GG' }, 
    { text: 'Guinea', value: 'GN' }, 
    { text: 'Guinea-Bissau', value: 'GW' }, 
    { text: 'Guyana', value: 'GY' }, 
    { text: 'Haiti', value: 'HT' }, 
    { text: 'Heard Island and Mcdonald Islands', value: 'HM' }, 
    { text: 'Holy See (Vatican City State)', value: 'VA' }, 
    { text: 'Honduras', value: 'HN' }, 
    { text: 'Hong Kong', value: 'HK' }, 
    { text: 'Hungary', value: 'HU' }, 
    { text: 'Iceland', value: 'IS' }, 
    { text: 'India', value: 'IN' }, 
    { text: 'Indonesia', value: 'ID' }, 
    { text: 'Iran, Islamic Republic Of', value: 'IR' }, 
    { text: 'Iraq', value: 'IQ' }, 
    { text: 'Ireland', value: 'IE' }, 
    { text: 'Isle of Man', value: 'IM' }, 
    { text: 'Israel', value: 'IL' }, 
    { text: 'Italy', value: 'IT' }, 
    { text: 'Jamaica', value: 'JM' }, 
    { text: 'Japan', value: 'JP' }, 
    { text: 'Jersey', value: 'JE' }, 
    { text: 'Jordan', value: 'JO' }, 
    { text: 'Kazakhstan', value: 'KZ' }, 
    { text: 'Kenya', value: 'KE' }, 
    { text: 'Kiribati', value: 'KI' }, 
    { text: 'Korea, Democratic People\'S Republic of', value: 'KP' }, 
    { text: 'Korea, Republic of', value: 'KR' }, 
    { text: 'Kuwait', value: 'KW' }, 
    { text: 'Kyrgyzstan', value: 'KG' }, 
    { text: 'Lao People\'S Democratic Republic', value: 'LA' }, 
    { text: 'Latvia', value: 'LV' }, 
    { text: 'Lebanon', value: 'LB' }, 
    { text: 'Lesotho', value: 'LS' }, 
    { text: 'Liberia', value: 'LR' }, 
    { text: 'Libyan Arab Jamahiriya', value: 'LY' }, 
    { text: 'Liechtenstein', value: 'LI' }, 
    { text: 'Lithuania', value: 'LT' }, 
    { text: 'Luxembourg', value: 'LU' }, 
    { text: 'Macao', value: 'MO' }, 
    { text: 'Macedonia, The Former Yugoslav Republic of', value: 'MK' }, 
    { text: 'Madagascar', value: 'MG' }, 
    { text: 'Malawi', value: 'MW' }, 
    { text: 'Malaysia', value: 'MY' }, 
    { text: 'Maldives', value: 'MV' }, 
    { text: 'Mali', value: 'ML' }, 
    { text: 'Malta', value: 'MT' }, 
    { text: 'Marshall Islands', value: 'MH' }, 
    { text: 'Martinique', value: 'MQ' }, 
    { text: 'Mauritania', value: 'MR' }, 
    { text: 'Mauritius', value: 'MU' }, 
    { text: 'Mayotte', value: 'YT' }, 
    { text: 'Mexico', value: 'MX' }, 
    { text: 'Micronesia, Federated States of', value: 'FM' }, 
    { text: 'Moldova, Republic of', value: 'MD' }, 
    { text: 'Monaco', value: 'MC' }, 
    { text: 'Mongolia', value: 'MN' }, 
    { text: 'Montserrat', value: 'MS' }, 
    { text: 'Morocco', value: 'MA' }, 
    { text: 'Mozambique', value: 'MZ' }, 
    { text: 'Myanmar', value: 'MM' }, 
    { text: 'Namibia', value: 'NA' }, 
    { text: 'Nauru', value: 'NR' }, 
    { text: 'Nepal', value: 'NP' }, 
    { text: 'Netherlands', value: 'NL' }, 
    { text: 'Netherlands Antilles', value: 'AN' }, 
    { text: 'New Caledonia', value: 'NC' }, 
    { text: 'New Zealand', value: 'NZ' }, 
    { text: 'Nicaragua', value: 'NI' }, 
    { text: 'Niger', value: 'NE' }, 
    { text: 'Nigeria', value: 'NG' }, 
    { text: 'Niue', value: 'NU' }, 
    { text: 'Norfolk Island', value: 'NF' }, 
    { text: 'Northern Mariana Islands', value: 'MP' }, 
    { text: 'Norway', value: 'NO' }, 
    { text: 'Oman', value: 'OM' }, 
    { text: 'Pakistan', value: 'PK' }, 
    { text: 'Palau', value: 'PW' }, 
    { text: 'Palestinian Territory, Occupied', value: 'PS' }, 
    { text: 'Panama', value: 'PA' }, 
    { text: 'Papua New Guinea', value: 'PG' }, 
    { text: 'Paraguay', value: 'PY' }, 
    { text: 'Peru', value: 'PE' }, 
    { text: 'Philippines', value: 'PH' }, 
    { text: 'Pitcairn', value: 'PN' }, 
    { text: 'Poland', value: 'PL' }, 
    { text: 'Portugal', value: 'PT' }, 
    { text: 'Puerto Rico', value: 'PR' }, 
    { text: 'Qatar', value: 'QA' }, 
    { text: 'Reunion', value: 'RE' }, 
    { text: 'Romania', value: 'RO' }, 
    { text: 'Russian Federation', value: 'RU' }, 
    { text: 'RWANDA', value: 'RW' }, 
    { text: 'Saint Helena', value: 'SH' }, 
    { text: 'Saint Kitts and Nevis', value: 'KN' }, 
    { text: 'Saint Lucia', value: 'LC' }, 
    { text: 'Saint Pierre and Miquelon', value: 'PM' }, 
    { text: 'Saint Vincent and the Grenadines', value: 'VC' }, 
    { text: 'Samoa', value: 'WS' }, 
    { text: 'San Marino', value: 'SM' }, 
    { text: 'Sao Tome and Principe', value: 'ST' }, 
    { text: 'Saudi Arabia', value: 'SA' }, 
    { text: 'Senegal', value: 'SN' }, 
    { text: 'Serbia and Montenegro', value: 'CS' }, 
    { text: 'Seychelles', value: 'SC' }, 
    { text: 'Sierra Leone', value: 'SL' }, 
    { text: 'Singapore', value: 'SG' }, 
    { text: 'Slovakia', value: 'SK' }, 
    { text: 'Slovenia', value: 'SI' }, 
    { text: 'Solomon Islands', value: 'SB' }, 
    { text: 'Somalia', value: 'SO' }, 
    { text: 'South Africa', value: 'ZA' }, 
    { text: 'South Georgia and the South Sandwich Islands', value: 'GS' }, 
    { text: 'Spain', value: 'ES' }, 
    { text: 'Sri Lanka', value: 'LK' }, 
    { text: 'Sudan', value: 'SD' }, 
    { text: 'Suriname', value: 'SR' }, 
    { text: 'Svalbard and Jan Mayen', value: 'SJ' }, 
    { text: 'Swaziland', value: 'SZ' }, 
    { text: 'Sweden', value: 'SE' }, 
    { text: 'Switzerland', value: 'CH' }, 
    { text: 'Syrian Arab Republic', value: 'SY' }, 
    { text: 'Taiwan, Province of China', value: 'TW' }, 
    { text: 'Tajikistan', value: 'TJ' }, 
    { text: 'Tanzania, United Republic of', value: 'TZ' }, 
    { text: 'Thailand', value: 'TH' }, 
    { text: 'Timor-Leste', value: 'TL' }, 
    { text: 'Togo', value: 'TG' }, 
    { text: 'Tokelau', value: 'TK' }, 
    { text: 'Tonga', value: 'TO' }, 
    { text: 'Trinidad and Tobago', value: 'TT' }, 
    { text: 'Tunisia', value: 'TN' }, 
    { text: 'Turkey', value: 'TR' }, 
    { text: 'Turkmenistan', value: 'TM' }, 
    { text: 'Turks and Caicos Islands', value: 'TC' }, 
    { text: 'Tuvalu', value: 'TV' }, 
    { text: 'Uganda', value: 'UG' }, 
    { text: 'Ukraine', value: 'UA' }, 
    { text: 'United Arab Emirates', value: 'AE' }, 
    { text: 'United Kingdom', value: 'GB' }, 
    { text: 'United States Minor Outlying Islands', value: 'UM' }, 
    { text: 'Uruguay', value: 'UY' }, 
    { text: 'Uzbekistan', value: 'UZ' }, 
    { text: 'Vanuatu', value: 'VU' }, 
    { text: 'Venezuela', value: 'VE' }, 
    { text: 'Viet Nam', value: 'VN' }, 
    { text: 'Virgin Islands, British', value: 'VG' }, 
    { text: 'Virgin Islands, U.S.', value: 'VI' }, 
    { text: 'Wallis and Futuna', value: 'WF' }, 
    { text: 'Western Sahara', value: 'EH' }, 
    { text: 'Yemen', value: 'YE' }, 
    { text: 'Zambia', value: 'ZM' }, 
    { text: 'Zimbabwe', value: 'ZW'} 
  ]

  private addressTypeChange(addressType: string): void {
    this.selectedCountry = addressType === "FOR" ? "" : "USA";
  }
}

</script>
