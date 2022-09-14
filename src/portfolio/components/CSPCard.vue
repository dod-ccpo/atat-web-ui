<template>
  <v-card class="_cspCard">
    <div class="d-flex pa-8">
      <div class="pr-6">
        <ATATSVGIcon
          name="azure"
          width="80"
          height="62"
          color="azure-blue"
        />
      </div>
      <div>
        <h3>Accessing your {{title[cloudServiceProvider]}}:</h3>
        <div class="d-flex align-center">
          <a>
            {{link[cloudServiceProvider]}}
          </a>
          <span class="pl-2 d-flex">
            <ATATSVGIcon width="15" height="15" name="launch" color="primary"/>
          </span>
        </div>
      </div>

    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
@Component({
  components: {
    ATATSVGIcon,
  }
})
export default class CSPCard extends Vue {
  @Prop() private cloudServiceProvider!: string;

  public title = {
    "Azure": "Azure Portal",
    "AWS": "AWS Management Console",
    "Google Cloud": "Google Cloud Console",
    "Oracle Cloud": "Oracle Cloud Console"
  }

  public link = {
    "Azure": "https://portal.azure.com/abc123",
    "AWS": "https://signin.amazonaws-us-gov.com",
    "Google Cloud": "https://console.cloud.google.com",
    "Oracle Cloud": "https://console.oraclecloud.com"
  }




}
</script>
