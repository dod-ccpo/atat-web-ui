<template>
  <div>
    <div>Step One</div>
    <v-container>
      <v-row>
        <v-col
            cols="12"
            md="4"
        >
          <v-text-field
              label="Textbox Label"
              required
          ></v-text-field>
          <v-select
              v-model="select"
              :items="items"
              :rules="[v => !!v || 'Item is required']"
              label="Select"
              required
          ></v-select>
          <atat-select
              class="clin-idiq-select max-width-100"
              label="Custom Select"
              placeholder="- Select -"
          >
          </atat-select>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<style>
.v-list-item__title {
  font-size: 1.4rem;
}
</style>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({})
export default class StepOne extends Vue {
    private select = null;
    private items = [
        'Programming',
        'Design',
        'Vue',
        'Vuetify',
    ]
}
</script>
