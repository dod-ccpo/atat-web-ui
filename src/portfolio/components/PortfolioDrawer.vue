<template>
  <div class="_portfolioDrawer">
    <div class="_portfolio-panel">
      <h3 class="mb-4 mt-6">About Portfolio</h3>
      <div>
        <v-textarea
          id="DrawerTextArea"
          v-model="portfolio.description"
          auto-grow
          autocomplete="off"
          class="_drawerTextArea pt-0 mb-4"
          dense
          hide-details
          placeholder="Add a description"
          rows="1"
          @blur="saveDescription"
        >
        </v-textarea>
        <div class="d-flex justify-space-between pb-4">
          Status
          <span class="tag"
          :class="getTag()">{{ portfolio.status }}</span>
        </div>
        <div class="d-flex justify-space-between pb-4">
          Cloud Service Provider
          <div class="d-flex align-center">
            <ATATSVGIcon
            :name="csp.toLowerCase()"
            width="20"
            height="16"
            class="mr-1"
            />
            <div>
              {{ portfolio.csp }}
            </div>
          </div>
        </div>
        <div class="d-flex justify-space-between pb-4">
          Service/Agency
          <div>
            {{ portfolio.serviceAgency }}
          </div>
        </div>
        <div class="d-flex justify-space-between">
          Created by
          <div class="_text-link">
            Maria Missionowner
          </div>
        </div>
      </div>
    </div>
    <hr class="my-8" />
    <div>
      <h3>Portfolio Members</h3>
    </div>
    <hr class="my-8" />
    <div class="_portfolio-panel pt-0">
      <div>
        Provisioned on {{provisionedTime}}
      </div>
      <div>
        Last updated {{updateTime}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import PortfolioData from "@/store/portfolio";
import { format, parseISO } from "date-fns"
import { Portfolio } from "types/Global";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";



@Component({
  components: {
    ATATSVGIcon,
  }
})

export default class PortfolioDrawer extends Vue {
  public portfolio: Portfolio= {}
  public provisionedTime = ""
  public updateTime = ""
  public csp = ""
  public saveDescription(): void {
    PortfolioData.setPortfolioData(this.portfolio)
  }

  public formatDate(date:string):string {
    return format(parseISO(date), 'MMM. d, Y, Hm')
  }

  public getTag(): string {
    switch (this.portfolio.status?.toLowerCase()) {
    case 'active':
      return "tag-green";
    case 'processing':
      return "tag-blue";
    case 'expiring pop':
      return "tag-warning";
    case 'expired':
      return "tag-error";
    case 'archived':
      return "tag-base";
    default:
      return "";
    }
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await PortfolioData.getPortfolioData()
    if (storeData) {
      this.portfolio = storeData
      if(storeData.provisioned && storeData.updated && storeData.csp){
        this.provisionedTime = this.formatDate(storeData.provisioned)
        this.updateTime = this.formatDate(storeData.updated)
        this.csp = storeData.csp
      }
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>
