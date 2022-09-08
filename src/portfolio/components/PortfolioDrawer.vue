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
          <div>
            <span>{{ portfolio.csp }}</span>
            {{ portfolio.csp }}
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
        Provisioned on {{provisionedDate()}}
      </div>
      <div>
        Last updated {{UpdatedDate()}}
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



@Component({
  components: {}
})

export default class PortfolioDrawer extends Vue {
  public portfolio: Portfolio= {}

  public saveDescription(): void {
    PortfolioData.setPortfolioData(this.portfolio)
  }

  public provisionedDate():string {
    if(this.portfolio.provisioned){
      return format(parseISO(this.portfolio.provisioned), 'MMM. d, Y, Hm')
    }
    return ""
  }
  public UpdatedDate():string {
    if(this.portfolio.updated){
      return format(parseISO(this.portfolio.updated), 'MMM. d, Y, Hm')
    }
    return ""
  }

  public getTag(): string {
    switch (this.portfolio.status?.toLowerCase()) {
    case 'active':
      return "tag-green";
    default:
      return "";
    }
  }

  public async loadOnEnter(): Promise<void> {
    const portfolio = await PortfolioData.getPortfolioData()
    if (portfolio) {
      this.portfolio = portfolio
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>
