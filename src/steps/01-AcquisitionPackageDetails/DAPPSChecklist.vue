<template>
  <v-form ref="form" lazy-validation>
    <v-container class="container-max-width mx-auto " fluid>
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Before you get started...
          </h1>
          <div class="copy-max-width">
            <p id="IntroP" class="mb-8 font-size-20" style="line-height: 1.67em;">
              Here are some of the topics that we’ll cover within DAPPS. We suggest having the
              following information and documents on hand to help you build your
              acquisition package.
            </p>
          </div>
          <div class="container-max-width">
            <div class="d-flex bg-primary-lighter py-6 px-6 mb-8 _border-rounded-more">
              <div class="mr-5">
                <ATATSVGIcon
                  name="JWCCPricingCalculator"
                  color="primary"
                  :width="80"
                  :height="80"
                />
              </div>
              <div>
                <h3 class="font-weight-500 text-primary mb-1"
                >
                  JWCC Pricing Calculators
                </h3>
                <p class="mb-0">
                  Before proceeding, request access to one or more Cloud Service Provider (CSP)
                  pricing calculators to help generate your JWCC cost estimates. You’ll receive
                  an email from each selected CSP with account login instructions.
                </p>
                <v-btn
                  :href="requestAccessURL"
                  id="RequestAccess"
                  target="_blank"
                  class="_primary mt-4 _text-decoration-none d-inline-block"
                >
                  Request access to CSP pricing calculators
                <ATATSVGIcon
                  id="RequestAccessIcon"
                  width="15"
                  height="15"
                  name="launch"
                  class="ml-2"
                  color="white"
                />
                </v-btn>
              </div>
            </div>
            <div class="d-flex mb-8 px-6">
              <div class="mr-5">
                <ATATSVGIcon
                  name="ContactInformation"
                  color="primary"
                  :width="80"
                  :height="80"
                />
              </div>
              <div>
                <h3 class="font-weight-500 text-primary mb-1 mt-3">
                  Contact Information
                </h3>
                <p class="mb-2">
                  Gather names, emails, and phone numbers for your main points of contact (POC):
                </p>
                <ul class="_atat-ul mt-3 pb-0">
                  <li>
                    Primary and Alternate Contracting Officer Representatives (COR/ACOR)
                  </li>
                  <li>
                    Financial POC (if incrementally funding)
                  </li>
                  <li class="pb-0">
                    Technical Support POC
                  </li>
                </ul>
              </div>
            </div>
            <div class="d-flex mb-8 px-6">
              <div class="mr-5">
                <ATATSVGIcon
                  name="CertifiedDocumentsForTransferringFunds"
                  color="primary"
                  :width="80"
                  :height="80"
                />
              </div>
              <div>
                <h3 class="font-weight-500 text-primary mb-1 mt-3">
                  Certified Documents for Transferring Funds
                </h3>
                <p class="mb-4">
                  Save time by completing your Fiscal Service Forms 7600A and 7600B within
                  G-Invoicing.
                  <a
                    id="LearnMoreGInvoicing"
                    role="button"
                    tabindex="0"
                    @click="openSlideoutPanel"
                    @keydown.enter="openSlideoutPanel"
                    @keydown.space="openSlideoutPanel"
                  >Learn More</a>
                </p>
                <p class="mb-0">
                  You can also upload these forms or a Military Interdepartmental Purchase Request
                  (MIPR).
                </p>
              </div>
            </div>
            <div class="d-flex mb-8 px-6">
              <div class="mr-5">
                <ATATSVGIcon
                  name="PeriodOfPerformance"
                  color="primary"
                  :width="80"
                  :height="80"
                />
              </div>
              <div>
                <h3 class="font-weight-500 text-primary mb-1 mt-3">
                  Period of Performance
                </h3>
                <p class="mb-0">
                  Determine the length and number of option periods needed. We’ll also check to
                  see if your task order needs to start before or after a specific date.
                </p>
              </div>
            </div>
            <div class="d-flex mb-8 px-6">
              <div class="mr-5">
                <ATATSVGIcon
                  name="OtherCommonDocumentation"
                  color="primary"
                  :width="80"
                  :height="80"
                />
              </div>
              <div>
                <h3 class="font-weight-500 text-primary mb-1 mt-3"
                >
                  Other Common Documentation
                </h3>
                <p>
                  We’ll check to see if your contract effort requires any of the following
                  forms or information:
                </p>
                <ul class="_atat-ul mt-4">
                  <li>
                    Previous contracts (e.g., contract number, contractor, and expiration date)
                  </li>
                  <li>
                    Business Associate Agreements, if applicable
                  </li>
                  <li>
                    Freedom of Information Act (FOIA) point of contact, if your requirement
                    contains protected information
                  </li>
                  <li class="pb-0">
                    DISA CIO Certification for Clinger Cohen Act and/or CyberNetOps Tools
                  </li>
                </ul>
              </div>
            </div>
          </div>
            <ATATAlert
              id="DappsChecklistAlert"
              type="warning"
              :showIcon="false"
              class="mb-0 mt-0"
            >
              <template v-slot:content>
                <p class="mb-0">
                  You may need authorization from your Military Service prior to placing a task 
                  order under the JWCC Contract. Customers are responsible for complying with 
                  Military Service-specific cloud acquisition requirements. Prior to proceeding 
                  with the development of your JWCC requirements package, each customer must 
                  confirm their understanding of this responsibility.
                </p>
              </template>
            </ATATAlert>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Hook, Vue, toNative } from "vue-facing-decorator";
import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import acquisitionPackage from "@/store/acquisitionPackage";
import { SlideoutPanelContent, SaveOnLeaveRefs } from "../../../types/Global";
import FundingRequestLearnMore from "@/steps/10-FinancialDetails/FundingRequestLearnMore.vue";
import SlideoutPanel from "@/store/slideoutPanel";
import ATATAlert from "@/components/ATATAlert.vue";
import { routeNames } from "@/router/stepper";
import Steps from "@/store/steps";
import AcquisitionPackage from "@/store/acquisitionPackage";


@Component({
  components: {ATATSVGIcon,ATATAlert}
})

class DAPPSChecklist extends Vue {
  
  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs,
      nextTick: this.$nextTick,
    })
  }

  public requestAccessURL = "https://community.hacc.mil/s/jwcc/pricing-calculator-request"
  public openSlideoutPanel(e: Event): void {
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }
  protected async saveOnLeave(): Promise<boolean> {
    try {
      await acquisitionPackage.setHideSideNavigation(false);
    } catch (error) {
      console.log(error);
    }
    return true;
  }
  async mounted(): Promise<void>{
    AcquisitionPackage.setSkipValidation(true);
    const comingFrom = Steps.prevStepName;
    if (comingFrom !== routeNames.ContractingShop
    && AcquisitionPackage.packageId !== "") {
      this.$router.push({
        name: routeNames.ContractingShop,
      }).catch(() => console.log("error Navigating to DAPPS Checklist"));      
    }
    
    await acquisitionPackage.setHideSideNavigation(true);
    const slideoutPanelContent: SlideoutPanelContent = {
      component: FundingRequestLearnMore,
      title: "Learn More",
    };
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
  }
}

export default toNative(DAPPSChecklist)
</script>
