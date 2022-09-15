<template>
  <v-card class="border1 border-base-lighter" elevation="0">
    <div class="d-flex pa-8">
      <div class="pr-6">
        <ATATSVGIcon
          id="CSPIcon"
          class="d-flex align-center"
          :name="providers[cloudServiceProvider].img.name"
          :width="providers[cloudServiceProvider].img.width"
          :height="providers[cloudServiceProvider].img.height"
          :color="providers[cloudServiceProvider].img.color"
        />
      </div>
      <div>
        <div>
          <h3 id="CSPTitle">Accessing your {{providers[cloudServiceProvider].title}}:</h3>
          <div class="d-flex align-center">
            <a id="CSPLink">
              {{providers[cloudServiceProvider].link}}
            </a>
            <span class="pl-2 d-flex">
            <ATATSVGIcon
              id="LinkIcon"
              width="15"
              height="15"
              name="launch"
              color="primary"
            />
          </span>
        </div>

        </div>
        <hr class="my-4" />
        <div>
          <p
            class="font-size-14 mb-0 text-base"
            id="CSPDescription"
          >
            {{providers[cloudServiceProvider].description}}

            <a id="LearnMoreLink">
              Learn more about accessing your CSP portal
            </a>
          </p>
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

  public providers = {
    "Azure":{
      title: "Azure Portal",
      link: "https://portal.azure.com/abc123",
      description: "To login to your cloud resources, you must have an Azure account. As a" +
        " portfolio manager, you can add administrators to grant full access to your CSP portal." +
        " Administrators will be able to manage all user access and permissions directly within" +
        " Azure.",
      img: {
        name:"azure",
        width:"80",
        height:"62",
        color:"azure-blue"
      }
    },
    "AWS":{
      title: "AWS Management Console",
      link: "https://signin.amazonaws-us-gov.com",
      description: "To login to the cloud resources for this portfolio, you must have an AWS" +
        " account. As a portfolio manager, you can add administrators to grant access to the CSP" +
        " portal within ATAT. Administrators will be able to manage team access and permissions" +
        " directly within AWS.",
      img: {
        name:"aws",
        width:"80",
        height:"48"
      }
    },
    "Google Cloud":{
      title: "Google Cloud Console",
      link: "https://console.cloud.google.com",
      description: "To login to the cloud resources for this portfolio, you must have an Google" +
        " Cloud account. As a portfolio manager, you can add administrators to grant access to" +
        " the CSP portal within ATAT. Administrators will be able to manage team access and" +
        " permissions directly within GCP.",
      img: {
        name:"gcp",
        width:"80",
        height:"71"
      }
    },
    "Oracle Cloud":{
      title: "Oracle Cloud Console",
      link: "https://console.oraclecloud.com",
      description: "To login to the cloud resources for this portfolio, you must have an OCI" +
        " account. As a portfolio manager, you can add administrators to grant access to the CSP" +
        " portal within ATAT. Administrators will be able to manage team access and permissions" +
        " directly within Oracle.",
      img: {
        name:"oracle",
        width:"80",
        height:"50"
      }
    },

  }
}
</script>
