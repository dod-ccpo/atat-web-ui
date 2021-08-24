<template>
 <v-container fluid>
      <v-row>
        <v-col cols="11" class="d-block">
            <v-expansion-panels> 
            <v-expansion-panel>
              <v-expansion-panel-header class="body-lg font-weight-bold">
                  <header>
                      <!-- header content here-->
                  </header>
              </v-expansion-panel-header>
                <v-expansion-panel-content>
                 <content>
                  <!-- content guest here -->    
                 </content>    
                </v-expansion-panel-content
            ></v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
 </v-container>
</template>


<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class ATATQuestionExpand extends Vue  {

    private test = "";
}