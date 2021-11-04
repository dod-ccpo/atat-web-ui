<template>
  <div class="body-lg">
    <div class="content-max-width">
      <h1 tabindex="-1">Your Applications Summary</h1>
      <p class="mb-8" v-if="cardsData.cards.length > 0">
        If you have more applications, <strong>add</strong> them below. You can
        also <strong>edit</strong> or <strong>delete</strong> any of the
        applications you have already entered. When you are done, click
        <strong>Next</strong> and we will move on to adding team members and
        assigning permissions within these applications.
      </p>
      <v-card v-else class="pa-12 mb-8 mt-0">
        <v-card-text class="pa-0">
          <p class="body-lg text-center text--base-dark mb-0">
            You currently do not have any applications.
          </p>
        </v-card-text>
      </v-card>
    </div>
    <section title="Application Summary Cards" role="region">
      <atat-summary-card
        v-if="cardsData.cards.length > 0"
        :data="cardsData"
        v-on:edit="onEdit"
        v-on:delete="onDelete"
        dialogWidth="420"
      ></atat-summary-card>

      <v-btn class="primary mb-10" :ripple="false" @click="onAddNew">
        <v-icon>control_point</v-icon>
        <div class="ml-2 font-weight-bold">Add an Application</div>
      </v-btn>
    </section>

    <section title="Application FAQs" class="content-max-width" role="region">
      <expandable-link
        header="What if I need to add more applications after my portfolio is provisioned?"
        content="In the future, team members with the appropriate permissions can add additional applications and/or environments directly within the cloud console.  We will set those permissions in the next step."
      ></expandable-link>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ValidatableWizardStep from "@/mixins/ValidatableWizardStep";
import ExpandableLink from "@/components/ExpandableLink.vue";

import {
  ATATSummaryCardGroupedItems,
  ATATSummaryCardItem,
  ATATSummaryCards,
} from "../../../../types/Wizard";
import { ApplicationModel } from "types/Portfolios";
import { addapplication, editapplication } from "@/router/wizard";

// Register the router hooks with their names
Component.registerHooks(["beforeRouteLeave"]);
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

  get applications(): ApplicationModel[] {
    return this.$store.getters.getApplications;
  }

  get cards(): ATATSummaryCardItem[] {
    const cardData = this.applications.map((application: ApplicationModel) => {
      const environments: ATATSummaryCardGroupedItems[] =
        application.environments
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

      return summarycardItem;
    });

    return cardData;
  }

  transformData(): void {
    this.cardsData.cards = this.cards;
  }

  mounted(): void {
    this.transformData();
  }

  async onDelete(id: string): Promise<void> {
    await this.$store.dispatch("deleteApplication", id);

    if (this.applications.length === 0) {
      //route the user back to add funding step
      this.$router.push({ name: addapplication.name });
    }

    this.transformData();
  }

  async onEdit(id: string): Promise<void> {
    this.$store.dispatch("editApplication", id);
    this.$router.push({
      name: editapplication.name,
      params: {
        id: id,
      },
    });
  }

  async onAddNew(id: string): Promise<void> {
    await this.$store.dispatch("addNewApplication");
    this.$router.push({
      name: addapplication.name,
      params: {
        id: id,
      },
    });
  }

  async beforeRouteLeave(
    to: unknown,
    from: unknown,
    next: (n: void) => void
  ): Promise<void> {
    next();
  }
}
</script>
