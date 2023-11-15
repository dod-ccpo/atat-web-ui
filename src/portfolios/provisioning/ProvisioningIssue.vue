<template>
    <div>
      <v-container fluid class="container-max-width mb-15">
          <h1 class="page-header">
              Provisioning Issue – Task Order {{ activeTaskOrder }}
          </h1>
        <v-row>
            <v-col class="mr-15">
                <p>
                  We encountered an issue while retrieving your task order details
                  from Electronic Data Access (EDA). To successfully provision a new
                  portfolio and track cloud spending within ATAT, we need to gather
                  missing information about your contract line item numbers (CLINs),
                  including period of performance dates and total/obligated values.
                </p>
                <v-list class="_atat-stepper mb-15">
                  <v-list-item 
                    v-for="(stepText, index) in stepsText"
                    :key="index"
                  >
                    <span class="_step-circle">{{ index + 1 }}</span>
                    {{ stepText }}
                  </v-list-item>
                </v-list>
                <v-btn 
                  class="v-btn _primary d-inline-block"
                  @click="returnToDashboard"
                >
                <ATATSVGIcon
                    width="15"
                    height="15"
                    name="arrowBack"
                    class="mr-2"
                    color="white"
                  />
                  Return to Dashboard
                </v-btn>
            </v-col>
            <v-col>
              <ATATSVGIcon 
              name="provisioningIssue"
              color="white"
              width="460"
              height="390"
              />
            </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
<script lang="ts">
import Vue from "vue";
import {Component } from 'vue-property-decorator'
import ATATSVGIcon from '@/components/icons/ATATSVGIcon.vue';
import PortfolioStore from '@/store/portfolio';
import AppSections from '@/store/appSections';
  
  @Component({
    components:{
      ATATSVGIcon
    }
  })
class ProvisioningIssue extends Vue {
  
    public stepsText =[
      `Contact your Contracting Officer to ensure all information
       is accurately entered within EDA. Updating improperly formatted
       data within that system can resolve this issue.`,
      `A support ticket has been generated, and a member of our
        Support Team will reach out within one business day.`
    ]
  
    public get activeTaskOrder(){
      return `#${PortfolioStore.activeTaskOrderNumber}`;
    }
  
    public async returnToDashboard(){
      await this.$router.push({
        name: "home"
      })
      AppSections.changeActiveSection(AppSections.sectionTitles.Home);
    }
  }
export default ProvisioningIssue
</script>