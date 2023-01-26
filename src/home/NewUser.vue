<template>
  <div>
    <section id="SectionCards" class="container-max-width mx-auto _mt-80 _mb-80">
      <div class="_new-user-cards d-flex justify-space-between">
        <NewAcquisitionCard @startNewAcquisition="startNewAcquisition" />
        <ExistingTaskOrderCard @startProvisionWorkflow="startProvisionWorkflow"/>
      </div>
    </section>
    <section 
      id="SectionPreparePackage" 
      class="_learn-more-section bg-white _py-80"
    >
      <div class="container-max-width">
        <h1 class="text-primary large text-center mb-10">
          Prepare your acquisition package online
        </h1>

        <v-row>
          <v-col class="pr-10">
            <p class="mt-5">
              The DISA Acquisition Package Preparation System (DAPPS) will walk you through
              the necessary steps to digitally prepare an acquisition package to procure 
              cloud resources through Joint Warfighting Cloud Capability (JWCC).
            </p>
            <p>
              Based on your responses to a series of questions, DAPPS will generate 
              documents specific to your requirements. With this completed requirements 
              package, you will have everything you need to begin the procurement process.
            </p>
            <v-btn
              id="StartNewAcquisitionButton"
              class="primary mb-4 mt-4"
              @click="startNewAcquisition"
              @keydown.enter="startNewAcquisition"
              @keydown.space="startNewAcquisition"
            >
              Start a new acquisition
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
              <v-btn 
                class="v-btn link-button no-border"
                @click="toggleShowNewFeatures"
              >
                <v-icon v-if="!showNewFeatures">navigate_next</v-icon>
                <v-icon v-if="showNewFeatures">expand_more</v-icon>
                <span><strong>Stay tuned for upcoming features! Read more</strong></span>
              </v-btn>
              <v-expand-transition>
                <div v-if="showNewFeatures">
                  <p class="mt-4 mb-0">
                    Soon, you will be able to:
                  </p>
                  <v-list class="_atat-stepper">
                    <v-list-item-group >
                      <v-list-item>
                        <span class="_step-circle">1</span>
                        <v-list-item-content>
                          Review and digitally sign documents prior to
                          submission.
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <span class="_step-circle">2</span>
                        <v-list-item-content>
                          <p class="font-size-16 mb-4">
                            Submit your completed package directly within
                            DAPPS, if you are using Defense Information
                            Technology Contracting Organization (DITCO).
                          </p>
                          <p class="font-size-16 mb-0">
                            Or, download your finalized documents and submit
                            them to your Contracting Office for processing.
                          </p>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </div>
              </v-expand-transition>
            </div>

          </v-col>
        </v-row>
      <hr class="my-0 _mt-80" />
      </div>
    </section>
    <section 
      id="SectionProvisionResources" 
      class="_learn-more-section bg-white _pb-80"
    >
      <div class="container-max-width">
        <h1 class="text-primary large text-center mb-10">
          Provision your cloud resources
        </h1>
        <v-row>
          <v-col class="pr-10">
            <p class="mt-8">
              Whether you used DAPPS to generate your acquisition package or obtained 
              a JWCC task order from your own Contracting Office, the Account Tracking 
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
              id="ProvisionButton"
              class="primary mb-4 mt-4"
              @click="openTOSearchModal"
              @keydown.enter="openTOSearchModal"
              @keydown.space="openTOSearchModal"
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
import ATATAlert from "@/components/ATATAlert.vue";
import ATATDivider from "@/components/ATATDivider.vue";

@Component({
  components: {
    NewAcquisitionCard,
    ExistingTaskOrderCard,
    ATATAlert,
    ATATDivider,
  }
})

export default class NewUser extends Vue {

  public startNewAcquisition(): void {
    this.$emit("startNewAcquisition");
  }

  public openTOSearchModal(): void {
    this.$emit("openTOSearchModal");
  }

  public prepareStepsText = [
    `Answer a series of questions about your project requirements.`,
    `Generate acquisition documents automatically based on the provided responses.`,
    `Download your completed package and review each document. Be sure to obtain
     signatures from approving officials, as necessary.`,
    `Submit your signed package to your Contracting Office via email
     for processing.`,
  ];

  public provisionStepsText = [
    `Provide a few details about your awarded task order and the individuals who 
     will administer your cloud resources.`,
    `Initiate provisioning and ATAT will automate the creation of your account 
     and environment with your Cloud Service Provider (CSP).`,
    `Track your cloud usage and manage spending throughout the duration of 
     the task order.`,
  ];

  public showNewFeatures = false;

  public toggleShowNewFeatures(): void {
    this.showNewFeatures = !this.showNewFeatures;
  }

  public startProvisionWorkflow(): void {
    this.$emit("startProvisionWorkflow");
  }

}

</script>  
