<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Which contract type applies to this acquisition?
          </h1>
          <div class="copy-max-width">
            <p class="mb-10">
              Firm-Fixed-Price (FFP) is the standard contract type for JWCC task orders. 
              You must provide justification for a time-and-materials (T&amp;M) or 
              hybrid contract, in accordance with 
              <a href="https://www.acquisition.gov/far/12.207" target="_blank">
                <span class="_external_link">FAR 12.207.</span>
              </a>
              If you are considering a T&amp;M contract, we suggest contacting the
              DITCO Contracting Office for further guidance.            
            </p>
            <p>
              Select all that apply to your contracting effort.
            </p>

          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component} from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";

@Component({
  components: {
    ATATCheckboxGroup,
  },
})

export default class POPStart extends Vue {
}
</script>
