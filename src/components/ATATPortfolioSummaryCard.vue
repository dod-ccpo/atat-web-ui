<template>
  <div class="portfolio-summary-cards-wrapper mb-10">
    <v-card
      v-for="(card, index) in data.cards"
      :key="index"
      class="width-100 py-5 px-6 d-flex"
      :class="{ first: index === 0, last: index === data.cards.length - 1 }"
      elevation="0"
    >
      <div class="pr-5">
        <div class="logo">CSP logo</div>
      </div>
      <div class="pr-5 flex-grow-1">
        <div
          class="d-flex mb-1 flex-row-reverse flex-md-row flex-column-reverse"
        >
          <div class="card-header flex-grow-1">
            <a
              role="button"
              @click="editPortfolio(card, $event)"
              @keydown.enter="editPortfolio(card, $event)"
              @keydown.space="editPortfolio(card, $event)"
              tabindex="0"
              class="h3 text-link"
            >
              {{ card.title }}
            </a>
          </div>
          <!-- NOTE logic for displaying alert banners will be need to be finalized
          after getting actual data from backend -->
          <div
            v-if="tempPortfolioStatus !== ''"
            class="
              status-alert-banner-wrapper
              ml-md-5
              text-md-right
              mb-2 mb-md-0
            "
          >
            <span
              class="status-alert-banner"
              :class="{
                info: tempPortfolioType === 'draft',
                archived: tempPortfolioType === 'archived',
                warning: tempPortfolioType === 'active' && index % 2,
                danger: tempPortfolioType === 'active' && !(index % 2),
              }"
            >
              {{ tempPortfolioType === "draft" ? "Draft" : "" }}
              {{ tempPortfolioType === "archived" ? "Archived" : "" }}
              {{ tempPortfolioType === "active" ? "Sample Alert" : "" }}
            </span>
            <!-- add class "warning", "danger", "info" (for drafts), or "archived"
            to status-alert-banner for different colored backgrounds -->
          </div>
        </div>
        <div class="text--base-dark mb-4">
          <a role="button" class="text-link" tabindex="0">Maria Missionowner</a>
          <atat-separator-bullet />
          <span>Army, Navy</span>

          <span v-if="tempPortfolioType === 'archived'">
            <atat-separator-bullet />
            <span class="text-no-wrap">Archived on Sept. 12, 2021</span>
          </span>
        </div>

        <div
          v-if="tempPortfolioType === 'draft'"
          class="text--base-dark d-flex"
        >
          <v-icon class="mr-1">task_alt</v-icon>
          2 of 5 steps complete
          <atat-separator-bullet />
          Last updated Oct. 1, 2022
        </div>

        <v-row v-if="tempPortfolioType === 'active'">
          <v-col class="col-12 col-md-4 col-lg-3 col-xl-2">
            <span class="data-header">Total Obligated</span>
            <span class="data-primary d-block text-no-wrap">
              $15,000,000.00
            </span>
          </v-col>
          <v-col class="col-12 col-md-4 col-lg-3">
            <span class="data-header">Funds Spent (%)</span>
            <span class="data-primary d-block">
              <span class="funds-spent mr-2 text-no-wrap">$10,000,000.00</span>
              <span class="funds-percent text-no-wrap">(67%)</span>
            </span>
            <span class="data-secondary d-block">
              $5,000,000.00 remaining
            </span>
          </v-col>

          <v-col class="col-12 col-md-4 col-lg-6">
            <span class="data-header">Current Period of Performance</span>
            <span class="data-primary d-block">
              <span class="text-no-wrap">Oct. 1, 2021 &ndash;</span>&nbsp;
              <span class="text-no-wrap">Sept. 31, 2022</span>
            </span>
            <span class="data-secondary d-block">
              5 days until next period of performance
            </span>
          </v-col>
        </v-row>
      </div>
      <div>
        <v-menu
          transition="slide-y-transition"
          offset-y
          nudge-left="192"
          nudge-top="1"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              :id="moreButtonId(card.id)"
              v-bind="attrs"
              v-on="on"
              class="meatball-menu-button mt-n1 width-auto pa-0"
            >
              <v-icon class="width-auto">more_horiz</v-icon>
            </v-btn>
          </template>
          <v-list class="meatball-menu pa-0">
            <v-list-item
              v-for="(menuOptionText, index) in menuOptions"
              :key="index"
              @click="handleMenuClick(menuOptionText, $event, card)"
            >
              <v-list-item-title class="body-lg py-2">
                {{ menuOptionText }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-card>

    <atat-modal-delete
      :showDialogWhenClicked.sync="showDialogWhenClicked"
      :title="dialogTitle"
      :isItemDeleted.sync="isItemDeleted"
      persistent
      no-click-animation
      :okText="okText"
      width="450px"
      @delete="onDelete"
      :focus-on-cancel="returnFocusElementIdCancel"
      :focus-on-ok="returnFocusElementIdOk"
    />

    <!--Archive Dialog -->
    <atat-dialog-base
      :showDialog.sync="showArchiveDialog"
      :title="archiveDialogTitle"
      persistent
      no-click-animation
      okText="Archive Portfolio"
      width="525px"
      :focusOnCancel="archiveFocusId"
      :focusOnOk="archiveFocusId"
    >
      <template #content>
        <p>
          After archiving, this portfolio will no longer appear in your ATAT
          dashboard and funding reports.
        </p>
        <ul>
          <li>
            Your portfolio will become read-only, so you will no longer be able
            to add funding or team members.
          </li>
          <li>You can access it in your Archived Portfolios list.</li>
        </ul>
        <p class="pt-6">
          <strong>NOTE: </strong> Archiving will NOT remove your portfolio from
          the cloud provider’s console. To avoid incurring unexpected costs, we
          recommend that your administrators manually delete this workspace from
          the cloud console before archiving.
        </p>
      </template>
    </atat-dialog-base>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Emit, Prop, PropSync, Watch } from "vue-property-decorator";
import { ATATSummaryCardItem, ATATSummaryCards } from "types/Wizard";
import ATATSeparatorBullet from "@/components/ATATSeparatorBullet.vue";
import ATATDialogBase from "@/components/ATATDialogBase.vue";

@Component({
  components: {
    "atat-separator-bullet": ATATSeparatorBullet,
    "atat-dialog-base": ATATDialogBase,
  },
})
export default class ATATPortfolioSummaryCard extends Vue {
  private draftOptions: string[] = [
    "Edit draft portfolio",
    "Delete draft portfolio",
  ];
  private activeOptions: string[] = ["Open portfolio", "Archive portfolio"];
  private archivedOptions: string[] = ["Open portfolio"];

  private dialogTitle = "";
  private dialogMessage = "";
  private showDialogWhenClicked = false;
  private showArchiveDialog = false;
  private archiveDialogTitle = "";
  private archiveFocusId = "";
  private returnFocusElementIdOk = "btn-create-new-portfolio";
  private returnFocusElementIdCancel = "";
  private isItemDeleted = false;
  private cardSelected: ATATSummaryCardItem = {};
  private okText = "";

  @Prop({
    default: {
      cards: [],
    },
    required: false,
  })
  private data!: ATATSummaryCards;

  // EJY temp props to show draft, active, and archived portfolio summary cards
  // for testing layout only -- logic for this and many other functionality will
  // be refactored/finalized once have actual data from the backend
  @Prop({ default: "" }) private tempPortfolioType?: string;
  @Prop({ default: "" }) private tempPortfolioStatus?: string;

  @PropSync("itemToDelete")
  private _itemToDelete!: string;

  get menuOptions(): string[] {
    switch (this.tempPortfolioType) {
      case "draft":
        return this.draftOptions;
      case "active":
        return this.activeOptions;
      case "archived":
        return this.archivedOptions;
      default:
        return [];
    }
  }

  private moreButtonId(portfolioId: string): string {
    if (portfolioId) {
      return "moreButton_" + portfolioId;
    }
    return "";
  }

  private confirmPortfolioDelete(card: ATATSummaryCardItem) {
    this.okText = "Delete Draft Portfolio";
    this.isItemDeleted = false;
    this.cardSelected = card;
    this.dialogTitle = `Delete  “${card.title}”?`;
    this.dialogMessage = `This draft portfolio will be permanently
      removed from ATAT. Any details you previously added will not be saved.`;
    if (card.id) {
      this.returnFocusElementIdCancel = this.moreButtonId(card.id);
    }
    this.showDialogWhenClicked = true;
  }

  @Watch("isItemDeleted")
  protected deleteItem(newVal: string): void {
    if (newVal !== "") {
      this._itemToDelete = newVal ? this.cardSelected.title || "" : "";
    }
  }

  private handleMenuClick(
    menuOptionText: any,
    event: Event,
    card: ATATSummaryCardItem // once have actual data, will need to make new type
  ): void {
    switch (menuOptionText) {
      case "Edit draft portfolio":
        this.$emit("portfolio-edit", card.id);
        break;
      case "Delete draft portfolio":
        this.confirmPortfolioDelete(card);
        break;
      case "Archive portfolio":
        this.archiveDialogTitle = `Archive '${card.title}'`;

        if (card.id) {
          this.archiveFocusId = this.moreButtonId(card.id);
        }
        this.showArchiveDialog = true;
        break;
      case "Open portfolio":
        this.$store.commit("wizard/setCurrentPortfolioId", card.id);
        this.$router.push({
          name: "portfoliosummary",
        });
        break;
    }
  }

  public editPortfolio(card: ATATSummaryCardItem, event: KeyboardEvent): void {
    if (event.code !== undefined) {
      event.preventDefault();
    }
    if (this.tempPortfolioType === "active") {
      this.$store.commit("wizard/setCurrentPortfolioId", card.id);
      this.$router.push({
        name: "portfoliosummary",
      });
    }
    if (this.tempPortfolioType === "draft") {
      this.$emit("portfolio-edit", card.id);
    }
  }

  @Emit("portfolio-delete")
  private onDelete(): string {
    return this.cardSelected.id || "";
  }
}
</script>
