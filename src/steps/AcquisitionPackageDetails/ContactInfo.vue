<template>
    <v-container fluid>
        <v-row class="form-section">
            <v-col>
                <h1 class="mb-10">Let’s confirm your contact information</h1>
                <ATATRadioGroup
                    legend="What role best describes your affiliation with the DoD?"
                    id="ContactRole"
                    :items="contactRoles"
                    :value.sync="selectedRole"
                    class="mb-8"
                />
                <ATATSelect
                    v-show="selectedRole !== 'MIL'"
                    id="Salutation"
                    class="input-max-width"
                    label="Salutation"
                    :optional="true"
                    placeholder=""
                    :items="salutationData"
                    :selectedValue.sync="selectedSalutation"
                />
                <ATATSelect
                    v-show="selectedRole === 'MIL'"
                    id="Rank"
                    class="input-max-width"
                    label="Rank"
                    :optional="true"
                    placeholder=""
                    :items="rankData"
                    :selectedValue.sync="selectedRank"
                />
            </v-col>
        </v-row>
        <v-row class="form-section">
            <v-col>
                <ATATTextField
                    label="First name"
                    id="FirstName"
                />
            </v-col>
            <v-col>
                <ATATTextField
                    label="Middle name"
                    id="MiddleName"
                    :optional="true"
                />
            </v-col>
            <v-col>
                <ATATTextField
                    label="Last name"
                    id="LastName"
                />
            </v-col>
            <v-col>
                <ATATTextField
                    label="Suffix"
                    id="Suffix"
                    :optional="true"
                    width="80px"
                />
            </v-col>
        </v-row>
        <v-row class="form-section">
            <v-col>
                <ATATTextField
                    label="Your email"
                    id="ContactEmail"
                    class="input-max-width mb-10"
                    helpText="Enter a .mil or .gov email address."
                />
                <ATATTextField
                    label="Your phone number"
                    id="ContactPhone"
                    class="input-max-width mb-10"
                />
                <ATATAutoComplete
                    v-show="selectedRole === 'CIV'"
                    id="ContactGrade"
                    optional="true"
                    class="input-max-width"
                    label="Grade"
                    :label-sr-only="false"
                    titleKey="grade"
                    :searchFields="['grade']"
                    :items="gradeData"
                    :selectedItem.sync="selectedGrade"
                    placeholder=""
                    icon="arrow_drop_down"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import Vue from "vue";

import {Component} from "vue-property-decorator";
import { RadioButton, SelectData } from "../../../types/Global";

@Component({
  components: {
    ATATAutoComplete,
    ATATTextField,
    ATATSelect,
    ATATRadioGroup
  },
})

export default class ContactInfo extends Vue {
    private selectedRole = "";
    private contactRoles: RadioButton[] = [
        {
            id: "Military",
            label: "Military",
            value: "MIL",
        },
        {
            id: "Civilian",
            label: "Civilian",
            value: "CIV",
        },
        {
            id: "Contractor",
            label: "Contractor",
            value: "CTR",
        },
    ];

    private selectedGrade = "";
    private gradeData = [
        { grade: "GS-01" },
        { grade: "GS-02" },
        { grade: "GS-03" },
        { grade: "GS-04" },
        { grade: "GS-05" },
        { grade: "GS-06" },
        { grade: "GS-07" },
        { grade: "GS-08" },
        { grade: "GS-09" },
        { grade: "GS-10" },
        { grade: "GS-11" },
        { grade: "GS-12" },
        { grade: "GS-13" },
        { grade: "GS-14" },
        { grade: "GS-15" },
        { grade: "SES" },
    ];

    private selectedSalutation = "";
    private salutationData: SelectData[] = [
        {
            text: "Mr.",
            value: "Mr.V",
        },
        {
            text: "Mrs.",
            value: "Mrs.V",
        },
        {
            text: "Miss",
            value: "MissV",
        },
        {
            text: "Ms.",
            value: "Ms.V",
        },
        {
            text: "Dr.",
            value: "Dr.V",
        },
    ];
    private selectedRank = "";
    private rankData: SelectData[] = [
        {
            text: "Private E-1 (PVT)",
            value: "PVT",
        },
        {
            text: "Private E-2 (PV2)",
            value: "PV2",
        },
        {
            text: "Private First Class (PFC)",
            value: "PFC",
        },
        {
            text: "Corporal (CPL)",
            value: "CPL",
        },
        {
            text: "Specialist (SPC)",
            value: "SPC",
        },
        {
            text: "Sergeant (SGT)",
            value: "SGT",
        },
        {
            text: "Staff Sergeant (SSG)",
            value: "SSG",
        },
    ];
}
</script>
