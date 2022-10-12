<template>
  <div class="bg-white pt-4">
    <div class="container-max-width">

      <v-row>    
        <v-col class="col-sm-12 col-md-7">
          alert and package/portfolio accordions (future ticket)
        </v-col>
        <v-col class="col-sm-12 col-md-5">
          <v-card class="py-7 px-5 _simple-border">
            <h3 class="text-primary mb-4d">Do you already have an awarded task order?</h3>
            <p>
              Provide a few details about your awarded task order and we’ll import 
              your info to provision your cloud resources.
            </p>
            <ATATSearch 
              buttonText="Search"
              placeholder="Search Task Order Number"
              class="mb-4 d-inline-block"
            />

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

export default class ExistingUser extends Vue {}

</script>