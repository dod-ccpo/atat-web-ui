<template>
  <div>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Do you require a cross-domain solution (CDS)?
          </h1>
          <div class="copy-max-width">
            <p class="mb-10" id="IntroP">
              In the next section, we will dive into the types of resources, tools, and services
              that you need for this acquisition. The classification level(s) that you select below
              will be applied to any performance requirements that you specify. If you need more
              than one level, we will walk you through what is required within each level later.
            </p>
           <AnticipatedDurationandUsage />
          </div>

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import AnticipatedDurationandUsage from "@/components/DOW/AnticipatedDurationandUsage.vue";
@Component({
  components: {AnticipatedDurationandUsage}
})
export default class CrossDomain extends Vue {
}
</script>

