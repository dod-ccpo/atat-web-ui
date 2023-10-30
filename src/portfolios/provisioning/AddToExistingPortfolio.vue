<template>
  <div>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header mb-1 py-0">
            Is this task order intended to fund one of your existing portfolios?
          </h1>
        
          <div class="copy-max-width">
            <p>
              Select on of your portfolios below and we will add your task order to it to continue
              funding. If this task order is for a new requirement, click "I need a new portfolio"
              button.
            </p>
          </div>
          <v-card
          v-for="(card, index) in portfolioCardData"
          :key="card.sys_id"
          class="_summary-card-wrapper _selectable"          
          :class="{ 
            '_first': index === 0, 
            '_last': index === portfolioCardData.length - 1,
            '_card-selected' : card.isSelected
          }"
          :id="'Package'+ index"
          elevation="0"
          @click="portfolioSelected(index)"
          @keydown.enter="portfolioSelected(index)"
          @keydown.space="portfolioSelected(index)"
        >
          <div class="flex-grow-1">
            <div class="d-flex">
              <div class="card-header flex-grow-1">
                <a
                  :id="'Portfolio' + index"
                  role="button"
                  tabindex="0"
                  class="h3 _text-decoration-none d-flex align-center _package-title"
                  @click="portfolioSelected(index)"
                  @keydown.enter="portfolioSelected(index)"
                  @keydown.space="portfolioSelected(index)"
                >
                  {{ card.title || 'Untitled package'}}
                </a>
              </div>
              <v-chip
                v-if="!card.fundingOnTrack && card.status !== ''"
                :id="'StatusChip' + index"
                :class="card.fundingStatusColor"
                label
              >
                {{card.status}}
              </v-chip>
            </div>

            <div class="text-base -size-14 d-flex align-center">
              <div :id="'CreatedBy'+ index" class="d-flex align-center _created-by">
                {{card.agencyDisplay}} 
                <ATATSVGIcon
                  name="bullet"
                  color="base-light"
                  :width="9"
                  :height="9"
                  class="d-inline-block mx-1"
                />
                {{ card.lastModifiedStr }}
              </div>
              <div
                :id="'ModifiedOrArchived'+ index"
                class="base d-flex align-center _last-modified">
                {{ card.updated }}
              </div>
            </div>
          </div>

        </v-card>
        </v-col>
      </v-row>
    </v-container>  
  </div>
</template>

<script lang="ts">
import { Component,  Vue } from "vue-facing-decorator";
import PortfolioSummary from "@/store/portfolioSummary";
import PortfolioCard from "../components/PortfolioCard.vue";
import AcquisitionPackage, { Statuses } from "@/store/acquisitionPackage";
import { PortfolioCardData } from "types/Global";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { createDateStr, getStatusChipBgColor } from "@/helpers";
import PortfolioStore from "@/store/portfolio";


@Component({
  components:{
    PortfolioCard,
    ATATSVGIcon
  }
})
class AddToExistingPortfolio extends Vue {

  public getPortfolioStatus(portfolioStatus: string): string{
    if(portfolioStatus === "") return "";

    const status = Object.keys(Statuses).find((status) =>
      Statuses[status].value === portfolioStatus
    ) ?? portfolioStatus;

    return Statuses[status].label
  }

  public portfolioCardData: PortfolioCardData[] = [];
  public selectedPackageSysId = "";

  public async portfolioSelected(index: number): Promise<void> {
    this.portfolioCardData.forEach(pkg => pkg.isSelected = false);
    this.portfolioCardData[index].isSelected = true;
    this.selectedPackageSysId = this.portfolioCardData[index].sysId as string;
    await PortfolioStore.setCurrentPortfolio(this.portfolioCardData[index])
    AcquisitionPackage.setDisableContinue(false);
    PortfolioStore.setProvisioningTOFollowOn(true)
  }

  public getChipColor(status: string){
    return getStatusChipBgColor(status)
  }

  public async loadOnEnter(): Promise<void> {
    AcquisitionPackage.setDisableContinue(true);
    const currentPortfolios = await 
    PortfolioSummary.getAllPortfolioSummaryList(false);
    // TODO: CHECK THIS DATA AFTER VUE3 MIGRATION
    currentPortfolios?.forEach((portfolio) => {
      if(portfolio.portfolio_status === Statuses.Active.value){
        const cardData: PortfolioCardData = {};
        cardData.isSelected = this.selectedPackageSysId !== undefined
          && portfolio.sys_id === this.selectedPackageSysId;
        cardData.lastUpdated = portfolio.last_updated;      
        cardData.sysId = portfolio.sys_id;
        cardData.title = portfolio.portfolio_name;
        cardData.status = this.getPortfolioStatus(portfolio.funding_status);
        cardData.agencyDisplay = portfolio.agency;
        cardData.fundingOnTrack = cardData.status === Statuses.OnTrack.label
        cardData.fundingStatusColor = this.getChipColor(portfolio.funding_status)
        const activeTaskOrder = portfolio.active_task_order;
        cardData.taskOrderNumber = activeTaskOrder;
        const updatedDate = createDateStr(portfolio.last_updated, true);
        cardData.lastModifiedStr = "Last modified " + updatedDate;
        this.portfolioCardData.push(cardData);
      }
    });
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
export default AddToExistingPortfolio
</script>
