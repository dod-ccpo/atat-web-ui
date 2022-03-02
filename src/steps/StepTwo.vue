<template>
  <div>
    <v-container>
      <v-row>
        <v-col class="col-sm-3">
          <ATATTextField
            label="Custom text-field"
            placeholder="Custom text-field"
            id="CustomTextField"
          />
        </v-col>
        <v-col class="col-sm-3">
          <ATATSelect
            id="DummyATATSelect"
            class="clin-idiq-select max-width-100"
            label="Custom Select"
            placeholder="Select"
          >
          </ATATSelect>
        </v-col>
        <v-col class="col-sm-4">
          <ATATAutoComplete
            id="TO_COR"
            label="Custom AutoComplete"
            :label-sr-only="false"
            titleKey="FullName"
            subtitleKey="Email"
            :searchFields="['FullName', 'Email']"
            :items="searchData"
            :selectedItem.sync="selectedContact"
            placeholder="Search by name or email"
            icon="search"
            noResultsText="Manually enter my contact’s information"
            @noAutoCompleteResultsAction="noAutoCompleteResultsAction"
          />
          <v-card v-if="contactIsSelected">
            <v-card-title>
              <strong>AUTOCOMPLETE SELECTED OBJECT</strong>
            </v-card-title>
            <v-card-text style="font-size: 12px; line-height: 1.5">
              <strong>Id:</strong> {{ selectedContact.Id }}<br/>
              <strong>FirstName:</strong> {{ selectedContact.FirstName }}<br/>
              <strong>LastName:</strong> {{ selectedContact.LastName }}<br/>
              <strong>FullName:</strong> {{ selectedContact.FullName }}<br/>
              <strong>Email:</strong> {{ selectedContact.Email }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="col-sm-12 col-md-8 col-lg-6">
          <Users></Users>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <ATATRadioGroup
            id="DummyATATRadio"
            label="Custom Radio"
            :value.sync="radioValue"
            :items="items"
            name="my-radio-group"
            card="true"
            :error="true"
          >
          </ATATRadioGroup>
          <ATATRadioGroup
            id="DummyATATRadio2"
            label="Custom Radio"
            :value.sync="radioValue"
            :items="items"
            name="another-radio-group"
          >
          </ATATRadioGroup>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <ATATCheckboxGroup
            id="ATATCheckbox"
            label="Custom Checkbox"
            :value.sync="ATATCheckboxValue"
            :items="checkboxItems"
            name="another-checkbox"
          />
          <ATATCheckboxGroup
            id="checkbox card"
            label="Custom Checkbox 2"
            :value.sync="ATATCheckboxValue"
            :items="checkboxItems"
            name="checkbox-card"
            card="true"
          />

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<style>
.v-list-item__title {
  font-size: 1.4rem !important;
  line-height: 1.5 !important;
}

</style>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({})
export default class StepTwo extends Vue {
    private checked = null;
    private select = null;
    private items = [
     'Programming',
      'Design',
      'Vue',
      'Vuetify',
    ]
}
</script>
