<template>
  <v-container fluid class="width-80 ml-0 mb-10">
    <v-row>
      <v-col col="12">
        <div class="h2">
          Are you authorized to spend government funds to provision cloud
          resources for your organization?
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12" class="pb-0">
        <p class="body-lg">
          A duly warranted Contracting Officer, who has the authority to execute
          task orders on your agency’s behalf, must authorize you to upload task
          orders and provision cloud resources, in accordance with agency policy
          and procedures.
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="py-0">
        <v-alert
          :icon="false"
          outlined
          type="warning"
          class="warning_lighter black--text body-lg black-icon width-80"
          border="left"
        >
          <div>
            <v-row>
              <v-col cols="1" class="text-center px-0">
                <v-icon class="icon-20">warning</v-icon>
              </v-col>
              <v-col cols="11" class="pl-0 body-lg black--text">
                By selecting Yes below, you acknowledge that you are subject to
                potential penalties that may include fines, imprisonment, or
                both, under the U.S. law and regulations for any false statement
                or misrepresentation in association with this portfolio
                submission or on any accompanying documentation.
              </v-col>
            </v-row>
          </div>
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- @click="isTaskOrderSigned(true)" -->
        <v-btn
          :class="[isYesButtonClicked ? 'primary' : 'v-btn--outlined', 'ma-2']"
          class="primary"
          :ripple="false"
          @click="authorizeUser(true)"
        >
          Yes
        </v-btn>
        <v-btn
          :class="[isNoButtonClicked ? 'primary' : 'v-btn--outlined', 'ma-2']"
          class="primary"
          :ripple="false"
          @click="authorizeUser(false)"
        >
          No
        </v-btn>
      </v-col>
    </v-row>

    <v-row style="min-height: 125px">
      <v-col class="d-flex justify-start py-0">
        <v-expand-transition>
          <div v-if="isNoButtonClicked">
            <v-alert
              :icon="false"
              outlined
              type="error"
              class="error_lighter black--text body-lg black-icon mx-auto"
              border="left"
            >
              <div class="d-flex align-start">
                <v-icon class="ml-5 mr-4 mt-1 icon-20">error</v-icon>
                <div>
                  <div class="h3 black--text">
                    You must be authorized to submit this portfolio
                  </div>
                  <div class="body-lg black--text mt-1">
                    Please contact your Contracting Officer to obtain
                    authorization to submit government funds and proceed with
                    provisioning cloud resources.
                  </div>
                </div>
              </div>
            </v-alert>
          </div>
        </v-expand-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class PostReview extends Vue {
  public isYesButtonClicked = false;
  public isNoButtonClicked = false;

  public authorizeUser(authorized: boolean): void {
    authorized
      ? this.$store.dispatch("authorizeUser")
      : this.$store.dispatch("unauthorizeUser");
    this.isYesButtonClicked = authorized;
    this.isNoButtonClicked = !authorized;
  }
}
</script>
