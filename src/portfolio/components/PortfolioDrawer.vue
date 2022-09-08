<template>
  <div class="_portfolioDrawer">
    <div>
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
            :name="portfolio.csp?.toLowerCase()"
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
        <div class="d-flex justify-space-between pb-4">
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
    <div>
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
import format from "date-fns/format"
import { Portfolio } from "types/Global";
import parseISO from "date-fns/parseISO";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";



@Component({
  components: {ATATSVGIcon}
})

export default class PortfolioDrawer extends Vue {
  public portfolio: Portfolio= {}
  public provisionedTime = ""
  public updateTime = ""
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
    const portfolio = await PortfolioData.getPortfolioData()
    if (portfolio) {
      this.portfolio = portfolio
      if(portfolio.provisioned && portfolio.updated){
        this.provisionedTime = this.formatDate(portfolio.provisioned)
        this.updateTime = this.formatDate(portfolio.updated)
      }
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>
