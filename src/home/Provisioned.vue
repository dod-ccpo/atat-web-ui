<template>
  <div>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header mb-3">Your portfolio is being provisioned!</h1>
          <div class="copy-max-width">
            <p class="mb-6">
              We’re working with [Microsoft Azure] to provision your cloud
              resources. This process can take up to 2 hours. We’ll email you
              when the process is complete, but you can come back here anytime
              for an up-to-date status of your portfolio and funding details.
            </p>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="provisioned d-flex justify-space-between width-100">
            <v-card 
              v-for="(item, idx) in cardData"
              :key=idx
              id="Provisioning" class="d-flex align-start pa-6 mr-6">
             <div class="mt-1">
             <ATATSVGIcon
                :name="item.icon"
                :width="item.iconWidth"
                :height="item.iconHeight"
                color="primary"
              />
             </div>
             <div class="ml-3">
              <h3>{{ item.headline }}</h3>
              <p v-html="item.text" class="ma-0 mt-2 body-sm">
              </p>
            </div>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

@Component({
  components: {
    ATATSVGIcon
  },
})
export default class Provisioned extends Vue {

  public cardData = [
    {
      icon: "CloudUpload",
      iconWidth: "36",
      iconHeight: "24",
      headline: "Provisioning",
      text: "We’re taking care of everything to set up your cloud resources and administrator " +
            "access, so there is nothing else you need to do."
    },  {
      icon: "People",
      iconWidth: "33",
      iconHeight: "21",
      headline: "CSP portal access",
      text: "Once provisioned, Microsoft Azure will notify your administrators with instructions " +
            "for obtaining access to the cloud console."
    },  {
      icon: "HelpOutline",
      iconWidth: "30",
      iconHeight: "30",
      headline: "Need help?",
      text: "Feel free to <a href='https://community.hacc.mil/s/contact' target='blank'>contact " +
            "us</a> if you have any questions. We are here to help!"
    }

  ]

}
</script>
