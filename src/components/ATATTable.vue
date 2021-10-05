<template>
  <v-data-table :headers="headers" :items="items" hide-default-footer>
    <template v-slot:header.display_name="{ header }">
      <div class="body d-flex justify-space-between">
        {{ header.text }}
      </div>
    </template>
    <template v-slot:header.workplace_access="{ header }">
      <div class="body">
        {{ header.text }}
      </div>
    </template>
    <template v-slot:item.display_name="{ item }">
      <div class="body font-weight-bold pt-2">
        {{ item.display_name }}
      </div>
      <div class="body text--base-dark pb-2">
        {{ item.email }}
      </div>
    </template>
    <template v-slot:item.workplace_access="{ item }">
      <div class="d-flex justify-space-between">
        <div class="body text--base-dark align-center">
          {{ item.workplace_access }}
        </div>

        <v-menu transition="slide-y-transition" bottom right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on"> ••• </v-btn>
          </template>

          <v-list>
            <v-list-item v-for="(item, i) in dropdownOptions" :key="i">
              <v-list-item-title>{{ item }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </template>
  </v-data-table>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Nav, NavItem } from "../../types/NavItem";

@Component({})
export default class ATATTable extends Vue {
  //props
  @Prop({ default: () => [] }) private headers!: string[];
  @Prop({ default: () => [] }) private items?: {
    display_name: string;
    email: string;
    access: string;
  }[];
  @Prop({ default: () => [] }) private dropdownOptions!: string[];
}
</script>
