<template>
  <div>
    <section id="SectionCards" class="container-max-width mx-auto _mt-80 _mb-80">
      <div class="_new-user-cards d-flex justify-space-between">
        <NewAcquisitionCard />
        <ExistingTaskOrderCard />
      </div>
    </section>

    <section 
      id="SectionPreparePackage" 
      class="_learn-more-section bg-base-lightest _py-80"
    >
      <div class="container-max-width">
        <h1 class="text-primary large text-center mb-10">
          Prepare your acquisition package online
        </h1>

        <v-row>
          <v-col class="pr-10">
            <p class="mt-5">
              The DISA Acquisition Package Preparation System (DAPPS) will walk you 
              through the necessary steps to digitally prepare, sign, and submit your
              acquisition package to procure cloud resources through JWCC.
            </p>
            <p>
              Based on your responses to a series of questions, DAPPS will generate
              documents specific to your requirements.
            </p>
            <v-btn
              id="StartNewAcquisition"
              class="primary mb-4 mt-4"
              @click="startNewAcquisition"
            >
              Start your new acquisition package
            </v-btn>

          </v-col>
          <v-col class="pl-10">
            <div class="bg-primary-lighter border-rounded-more pa-8">

              <p class="mb-0">
                You can expect to:
              </p>
              <v-list class="_atat-stepper">
                <v-list-item-group >
                  <v-list-item 
                    v-for="(stepText, index) in prepareStepsText"
                    :key="index"
                  >
                    <span class="_step-circle">{{ index + 1 }}</span>
                    <v-list-item-content>
                      {{ stepText }}
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </div>
          </v-col>
        </v-row>
      </div>
    </section>

    <section 
      id="SectionProvisionResources" 
      class="_learn-more-section bg-white _py-80"
    >
      <div class="container-max-width">
        <h1 class="text-primary large text-center mb-10">
          Provision your cloud resources
        </h1>

        <v-row>
          <v-col class="pr-10">
            <p class="mt-5">
              Whether you used DAPPS to generate your acquisition package or obtained 
              a JWCC task order from your own contracting office, the Account Tracking 
              and Automation Tool (ATAT) will enable you to provision accounts and 
              environments for your cloud contracts.
            </p>
            <p>
              ATAT also provides a reporting dashboard that tracks cloud usage and 
              other metrics across your portfolio. This will give you a better 
              understanding of how your team is using cloud to help you manage 
              spending throughout the duration of your task order.
            </p>
            <v-btn
              id="StartNewAcquisition"
              class="primary mb-4 mt-4"
            >
              Provision new cloud resources
            </v-btn>

          </v-col>
          <v-col class="pl-10">
            <div class="bg-primary-lighter border-rounded-more pa-8">

              <p class="mb-0">
                You can expect to:
              </p>
              <v-list class="_atat-stepper">
                <v-list-item-group >
                  <v-list-item 
                    v-for="(stepText, index) in provisionStepsText"
                    :key="index"
                  >
                    <span class="_step-circle">{{ index + 1 }}</span>
                    <v-list-item-content>
                      {{ stepText }}
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </div>
          </v-col>
        </v-row>
      </div>
    </section>

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import NewAcquisitionCard from "./components/NewAcquisitionCard.vue";
import ExistingTaskOrderCard from "./components/ExistingTaskOrderCard.vue";
import Steps from "@/store/steps";
import AppSections from "@/store/appSections";
import { routeNames } from "@/router/stepper";

@Component({
  components: {
    NewAcquisitionCard,
    ExistingTaskOrderCard,
  }
})

export default class NewUser extends Vue {

  public async startNewAcquisition(): Promise<void> {
    await Steps.setAltBackDestination(AppSections.sectionTitles.Home);
    this.$router.push({name: routeNames.ProjectOverview });
    AppSections.changeActiveSection(AppSections.sectionTitles.AcquisitionPackage);
  }

  public prepareStepsText = [
    `Answer questions about your project requirements. You can add other people 
     from your organization to help, if needed`,
    `Based on your responses, requirements package documents will be automatically 
     generated.`,
    "Review and digitally sign your initial forms",
    `Route documents to your approving officials, obtain their signatures, and 
     monitor the approval progress.`,
    `Submit your completed requirements package to your contracting office to 
     begin the procurement process.`,
  ];

  public provisionStepsText = [
    `Provide a few details about your awarded task order and the individuals who 
     will administer your cloud resources.`,
    `Once you initiate provisioning, ATAT will automate account and environment 
     creation with your CSP.`,
    `Track your cloud usage and manage spending throughout the duration of 
     the task order`,
  ]

}

</script>
