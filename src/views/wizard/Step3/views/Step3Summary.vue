<template>
  <div class="body-lg">
    <div class="content-max-width">
      <h1 tabindex="-1">Your Applications Summary</h1>
      <p class="mb-8" v-if="cardsData.cards.length > 0">
        If you have more applications, <strong>add</strong> them below. You can
        also <strong>edit</strong> or <strong>delete</strong> any of the
        applications you have already entered.
        <span v-if="!isReturnToReview"
          >When you are done, click <strong>Next</strong> and we will move on to
          adding team members and assigning permissions within these
          applications.</span
        ><span v-else>
          When you are done, click
          <strong>Return to Review and Submit</strong> to finalize your
          portfolio.</span
        >
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
        return-focus-element-id-ok="AddApplicationButton"
      ></atat-summary-card>

      <v-btn
        class="primary mb-10"
        :ripple="false"
        @click="onAddNew"
        role="link"
        id="AddApplicationButton"
      >
        <v-icon>control_point</v-icon>
        <div class="ml-2 font-weight-bold">Add an Application</div>
      </v-btn>
    </section>

    <section title="Application FAQs" class="content-max-width" role="region">
      <expandable-link aria-id="ApplicationFAQ1">
        <template v-slot:header>
          What if I need to add more applications after my portfolio is
          provisioned?
        </template>
        <template v-slot:content>
          In the future, team members with the appropriate permissions can add
          additional applications and/or environments directly within the cloud
          console. We will set those permissions in the next step.
        </template>
      </expandable-link>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import ValidatableWizardStep from "@/mixins/ValidatableWizardStep";
import ExpandableLink from "@/components/ExpandableLink.vue";

import {
  ATATSummaryCardGroupedItems,
  ATATSummaryCardItem,
  ATATSummaryCards,
} from "../../../../../types/Wizard";
import { ApplicationModel } from "types/Portfolios";
import { addapplication, editapplication } from "@/router/wizard";
import ApplicationModuleData from "@/mixins/ApplicationModuleData";

// Register the router hooks with their names
Component.registerHooks(["beforeRouteLeave"]);
@Component({
  mixins: [ValidatableWizardStep],
  components: {
    ExpandableLink,
  },
})
export default class Step3Summary extends mixins(ApplicationModuleData) {
  private itemToDelete = "";
  private cardsData: ATATSummaryCards = {
    cards: [],
  };
  private isReturnToReview = false;
  private isArrivedFromStep5 = this.$store.getters["wizard/isArrivedFromStep5"];
  public async validate(): Promise<boolean> {
    return true;
  }

  get applications(): ApplicationModel[] {
    return this.applicationsState.applicationModels;
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
    if (this.isArrivedFromStep5) {
      this.$store.dispatch("wizard/setReturnToReview", true);
      this.isReturnToReview = true;
    }
  }

  async onDelete(id: string): Promise<void> {
    await this.deleteApplication(id);

    if (this.applications.length === 0) {
      //route the user back to add funding step
      this.$router.push({ name: addapplication.name });
    }

    this.transformData();
  }

  async onEdit(id: string): Promise<void> {
    this.$store.dispatch("wizard/editApplication", id);
    this.$store.dispatch("wizard/setReturnToReview", false);

    this.$router.push({
      name: editapplication.name,
      params: {
        id: id,
      },
    });
  }

  async onAddNew(id: string): Promise<void> {
    await this.$store.dispatch("wizard/addNewApplication");
    this.$store.dispatch("wizard/setReturnToReview", false);

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
