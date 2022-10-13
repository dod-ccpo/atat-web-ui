<template>
  <div class="bg-white pt-8 pb-10">
    <div class="container-max-width">

      <v-row>    
        <v-col class="col-sm-12 col-md-7">
          alert and package/portfolio accordions (future ticket)
        </v-col>
        <v-col class="col-sm-12 col-md-5">
          <v-card flat class="py-7 mb-10 px-5 _simple-border">
            <h3 class="text-primary mb-4">Do you already have an awarded task order?</h3>
            <p>
              Provide a few details about your awarded task order and we’ll import 
              your info to provision your cloud resources.
            </p>
            <ATATSearch 
              buttonText="Search"
              placeholder="Search Task Order Number"
              class="mb-4 d-inline-block"
              width="auto"
              wrapperWidth="100%"
            />
          </v-card>

          <v-card flat class="py-7 mb-10 px-5 _simple-border">
            <h3 class="text-primary mb-4">What else could we help you with?</h3>
            <v-btn
              id="StartNewAcquisitionButton"
              class="primary mb-4 mt-4 width-100"
              @click="startNewAcquisition"
              @keydown.enter="startNewAcquisition"
              @keydown.space="startNewAcquisition"
            >
              Start your new acquisition package
            </v-btn>
            <v-btn
              id="StartNewAcquisitionButton"
              class="secondary mt-4 width-100"
            >
              Create a new portfolio
            </v-btn>

          </v-card>

        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATSearch from "@/components/ATATSearch.vue";

@Component({
  components: {
    ATATSearch,
  }
})

export default class ExistingUser extends Vue {
  public startNewAcquisition(): void {
    this.$emit("startNewAcquisition");
  }

}

</script>