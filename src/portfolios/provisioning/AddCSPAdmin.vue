<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col>
        <h1 class="page-header">
          Now, let’s add administrators to manage your CSP portal
        </h1>
        <p class="page-intro">
          Before we can start provisioning, you need to add at least one Cloud 
          Service Provider (CSP) administrator. These individuals will be granted 
          full access to your cloud resources within the {{ csp }} portal, enabling 
          them to manage user accounts and configure workspace settings. 
          <a
            role="button"
            id="CSPAdminLearnMore"
            class="_text-link"
            tabindex="0"
            @click="openSlideoutPanel"
            @keydown.enter="openSlideoutPanel"
            @keydown.space="openSlideoutPanel">
            Learn more about administrators
          </a>         
        </p>

        <div 
          v-if="admins.length === 0"
          class="w-100 py-10 border1 border-rounded border-base-lighter 
            text-center mb-10 mt-10 bg-base-off-white"
        >
          <h2 class="h3 mb-6 mt-2">You do not have any CSP administrators yet.</h2>
          <v-btn
            id="AddCSPAdmin"
            class="primary mx-auto mb-2"
            @click="openAddCSPModal"
            @keydown.enter="openAddCSPModal"
            @keydown.space="openAddCSPModal">
          >
            <ATATSVGIcon 
              color="white"
              height="14"
              width="20"
              name="personAdd"
              class="mr-4 mt-1"
            />
            Add a CSP Administrator
          </v-btn> 
        </div>

      
      <ATATDialog 
        id="AddCSPAdminModal"
        :showDialog.sync="openModal"
        title="Add a CSP administrator"
        no-click-animation
        okText="Add administrator"
        width="632"
        :OKDisabled="ModalOKDisabled"
        @ok="AddCSPAdmin"
        :modalSlideoutComponent="modalSlideoutComponent"
        modalSlideoutTitle="Learn more about CSP administrators"
        :modalDrawerIsOpen.sync="modalDrawerIsOpen"
      >
        <template #content>
          <p class="body">
            This individual will be granted full access to the CSP console to manage 
            user accounts and configure workspace settings. 
            <a id="LearnMoreLink" role="button" @click="openLearnMoreDrawer">
              Learn more
            </a>

          </p>
        </template>
      </ATATDialog>

      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATDialog from "@/components/ATATDialog.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import CSPAdminLearnMore from "./AddCSPAdminLearnMore.vue";
import CSPAdminLearnMoreText from "./AddCSPAdminLearnMoreText.vue";

import SlideoutPanel from "@/store/slideoutPanel";
import { PortfolioAdmins, SlideoutPanelContent } from "types/Global";
import PortfolioStore from "@/store/portfolio";
import _ from "lodash";

@Component({
  components: {
    ATATDialog,
    ATATSVGIcon,
    CSPAdminLearnMore,
    CSPAdminLearnMoreText
  }
})

export default class AddCSPAdmin extends Vue {

  public admins: PortfolioAdmins[] = [];
  public csp = "";
  public openModal = false;
  public ModalOKDisabled = false;
  public modalSlideoutComponent = CSPAdminLearnMoreText;
  public modalDrawerIsOpen = false;

  public get currentData(): PortfolioAdmins[] {
    return this.admins;
  } 
  public savedData: PortfolioAdmins[] = [];

  public openSlideoutPanel(e: Event): void {
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }

  public openLearnMoreDrawer(): void {
    this.modalDrawerIsOpen = true;
  }
  public openAddCSPModal(): void {
    this.openModal = true;
  }

  public AddCSPAdmin(): void {
    debugger;
  }


  public async loadOnEnter(): Promise<void> {
    const storeData = PortfolioStore.portfolioProvisioningObj;
    if (storeData) {
      this.admins = _.cloneDeep(storeData.admins) || [];
      this.savedData = _.cloneDeep(this.admins);
      this.csp = storeData.csp as string;
    }
  }

  public async mounted(): Promise<void> {
    const slideoutPanelContent: SlideoutPanelContent = {
      component: CSPAdminLearnMore,
      title: "Learn More",
    };
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
    await this.loadOnEnter();
  }



}

</script>
