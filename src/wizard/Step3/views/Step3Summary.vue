<template>
  <v-container class="pb-10">
    <v-row>
      <v-col cols="10">
        <h2 class="h2">Your Applications Summary</h2>
        <p class="my-3 body-lg" v-show="cardsData.cards.length > 0">
          If you have more applications, <strong>add</strong> them below. You
          can also <strong>edit</strong> or <strong>delete</strong> any of the
          applications you have already entered. When you are done, click
          <strong>Next</strong> and we will move on to adding team members and
          assigning permissions within these applications.
        </p>
      </v-col>
    </v-row>
    <atat-summary-card
      :data="cardsData"
      :itemToDelete.sync="itemToDelete"
      dialogWidth="420"
    ></atat-summary-card>
    <v-row>
      <v-col cols="10">
        <v-btn to="/wizard/addapplication" class="primary" :ripple="false">
          <v-icon>control_point</v-icon>
          <div class="ml-2 font-weight-bold">Add an Application</div>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="10">
        <expandable-link
          header="What if I need to add more applications after my portfolio is provisioned?"
          content="In the future, team members with the appropriate permissions can add additional applications and/or environments directly within the cloud console.  We will set those permissions in the next step."
        ></expandable-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import ValidatableWizardStep from "@/mixins/ValidatableWizardStep";
import ExpandableLink from "../../components/ExpandableLink.vue";

import {
  ATATSummaryCardGroupedItems,
  ATATSummaryCardItem,
  ATATSummaryCards,
} from "../../../../types/Wizard";
import { Portfolio } from "types/Portfolios";

@Component({
  mixins: [ValidatableWizardStep],
  components: {
    ExpandableLink,
  },
})
export default class Step3Summary extends Vue {
  private itemToDelete = "";
  private cardsData: ATATSummaryCards = {
    cards: [],
  };

  public async validate(): Promise<boolean> {
    return true;
  }
  @Watch("itemToDelete")
  private deleteItem(newVal: string) {
    if (newVal !== "") {
      this.cardsData.cards = this.$store.getters.deletePortfolioById(
        this.itemToDelete
      );
      this.itemToDelete = "";
    }
  }
  public getPortfolioById(id?: string): Portfolio {
    id = id || "11";
    return this.$store.getters.getPortfolioById(id);
  }

  mounted(): void {
    let portfolio = this.getPortfolioById();
    let cardsData = this.cardsData;
    if (portfolio.applications) {
      portfolio.applications.forEach((application) => {
        const environments: ATATSummaryCardGroupedItems[] =
          application.environments != undefined
            ? application.environments?.map<ATATSummaryCardGroupedItems>(
                (env) => ({
                  title: env.name,
                })
              )
            : [];

        const summarycardItem: ATATSummaryCardItem = {
          type: "APPLICATION",
          id: application.id,
          title: application.name,
          description: application.description || undefined,
          showChevronRight: true,
          groupedItemsHeader: "Environments",
          items: environments,
          leftButtonText: "Edit",
          rightButtonText: "Delete",
        };

        cardsData.cards.push(summarycardItem);
      });
    }
  }
}
</script>
