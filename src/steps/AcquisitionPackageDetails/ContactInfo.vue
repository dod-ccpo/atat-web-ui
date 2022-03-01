<template>
    <v-container fluid>
        <v-row class="form-section">
            <v-col>
                <h1 class="mb-10">Let’s confirm your contact information</h1>
                <fieldset class="mb-10">
                    <legend>
                        What role best describes your affiliation with the DoD? 
                    </legend>
                    <ATATRadioGroup
                        id="ContactRole"
                        :items="contactRoles"
                        :value.sync="selectedRole"

                    />
                </fieldset>

                <ATATSelect
                    id="Salutation"
                    class="input-max-width"
                    label="Salutation"
                    :optional="true"
                    placeholder=""
                    :items="salutationData"
                    :selectedValue.sync="selectedSalutation"
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
                    inputHelperText="Enter a .mil or .gov email address."
                />
                <ATATTextField
                    label="Your phone number"
                    id="ContactPhone"
                    class="input-max-width mb-10"
                />

                <ATATAutoComplete
                    id="ContactGrade"
                    class="input-max-width"
                    label="Custom AutoComplete"
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

<style scoped>
fieldset {
    border: none;
}
</style>

<script lang="ts">
import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import Vue from "vue";

import {Component} from "vue-property-decorator";
import { SelectData } from "../../../types/Global";

@Component({
  components: {
    ATATAutoComplete,
    ATATTextField,
    ATATSelect,
    ATATRadioGroup
  },
})

export default class ContactInfo extends Vue {
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
    ]

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

    // EJY  update this after Devonte's new code 
    // for radios merged in
    private selectedRole = "";
    private contactRoles = [
        "Military", "Civilian", "Contractor"
    ];
}


</script>