<template>
  <v-card class="border1 border-base-lighter" elevation="0">
    <div class="d-flex pa-8">
      <div class="pr-6">
        <ATATSVGIcon
          id="CSPIcon"
          class="d-flex align-center"
          :name="providers[cloudServiceProvider.toLowerCase()].img.name"
          :width="providers[cloudServiceProvider.toLowerCase()].img.width"
          :height="providers[cloudServiceProvider.toLowerCase()].img.height"
        />
      </div>
      <div>
        <div>
          <div class="h3" id="CSPTitle">
            Accessing your {{providers[cloudServiceProvider.toLowerCase()].title}}:
          </div>
          <div class="d-flex align-center">
            <a id="CSPLink">
              {{providers[cloudServiceProvider.toLowerCase()].link}}
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
            To login to your cloud resources, you must have
            {{providers[cloudServiceProvider.toLowerCase()].accountName}} account.
            As a portfolio manager, you can add administrators to grant full
            access to your CSP portal. Administrators will be able to manage
            all user access and permissions directly within
            {{providers[cloudServiceProvider.toLowerCase()].withinName}}.
            <a role="button" id="LearnMoreLink"
               tabindex="0"
               @click="openSlideoutPanel"
               @keydown.enter="openSlideoutPanel"
               @keydown.space="openSlideoutPanel"
            >
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
import { SlideoutPanelContent } from "../../../../../types/Global";
import SlideoutPanel from "@/store/slideoutPanel";
import AccessingCSPLearnMore from
  "@/portfolios/portfolio/components/shared/AccessingCSPLearnMore.vue";
import { cspConsoleURLs } from "@/store/portfolio";


@Component({
  components: {
    ATATSVGIcon,
  }
})

export default class CSPCard extends Vue {
  @Prop() private cloudServiceProvider!: string;

  public providers = {
    "azure":{
      title: "Azure Portal",
      link: cspConsoleURLs.azure,
      accountName:"an Azure",
      withinName:"Azure",
      img: {
        name:"azure",
        width:"80",
        height:"62",
      }
    },
    "aws":{
      title: "AWS Management Console",
      link: cspConsoleURLs.aws,
      accountName:"an AWS",
      withinName:"AWS",
      img: {
        name:"aws",
        width:"80",
        height:"48"
      }
    },
    "google":{
      title: "Google Cloud Console",
      link: cspConsoleURLs.google,
      accountName:"a Google Cloud",
      withinName:"GCP",
      img: {
        name:"gcp",
        width:"80",
        height:"71"
      }
    },
    "oracle":{
      title: "Oracle Cloud Console",
      link: cspConsoleURLs.oracle,
      accountName:"an OCI",
      withinName:"Oracle",
      img: {
        name:"oracle",
        width:"80",
        height:"50"
      }
    },
  }
  public async openSlideoutPanel(e: Event): Promise<void> {
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      const slideoutPanelContent: SlideoutPanelContent = {
        component: AccessingCSPLearnMore,
        title: "Learn More",
      }
      await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);

      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }
}
</script>
