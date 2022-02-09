<template>
  <div>
    <div>Step Two</div>
    <v-container>
      <v-row>
        <v-col
            cols="12"
            md="4"
        >
          <p>{{ checked }}</p>
          <v-checkbox v-for="item in items" :key="item"
              v-model="checked"
              :label= item
              :value=item
          ></v-checkbox>
          <v-combobox
              v-model="select"
              :items="items"
              label="Combobox"
              multiple
              outlined
              dense
          ></v-combobox>
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
