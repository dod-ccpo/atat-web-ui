<template>
  <ATATDialog
    :id="id"
    :showDialog.sync="_showArchivePortfolioModal"
    title="Archive portfolio"
    no-click-animation
    okText="Archive portfolio"
    cancelText="Cancel"
    width="450"
    @ok="okClicked"
    @cancelClicked="cancelClicked"
    okButtonId="ArchiveButton_OK"
    cancelButtonId="ArchiveButton_Cancel"
  >
    <template #content>
      <div class="body">
        After archiving, this portfolio will no longer appear in your ATAT dashboard and funding
        reports.
        Your portfolio will become read-only, so you will no longer be able to add funding or
        team members.
        NOTE: Archiving will NOT remove your portfolio from ddd's console.
        To avoid incurring unexpected costs, we recommend that your administrators delete
        this workspace from the cloud console before you archive it in ATAT.
      </div>
    </template>
  </ATATDialog>
</template>

<script lang="ts">
import ATATDialog from "@/components/ATATDialog.vue";
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";

@Component({
  components: {
    ATATDialog
  }
})

export default class ArchivePortfolioModal extends Vue {
  @PropSync("showArchivePortfolioModal") public _showArchivePortfolioModal?: boolean;
  @Prop({ default: "ArchivePortfolioModal"}) public id?: string;

  public okClicked(): void {
    this._showArchivePortfolioModal = false;
    this.$emit("okClicked", 'Archived');
  }

  public cancelClicked(): void {
    this._showArchivePortfolioModal = false;
  }
}

</script>
