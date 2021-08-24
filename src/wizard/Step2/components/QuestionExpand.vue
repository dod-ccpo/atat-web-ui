<template>
  <v-container fluid>
    <v-expansion-panels flat>
      <v-expansion-panel>
        <v-expansion-panel-header class="body-lg font-weight-bold">
          <slot name="header"></slot>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <content>
            <!-- content guest here -->
          </content>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class QuestionExpand extends Vue {}
</script>
