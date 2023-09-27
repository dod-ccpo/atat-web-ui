<template>
  <ATATDialog
    id="ArchivePortfolioModal"
    :showDialog="showArchivePortfolioModal"
    :title="'Archive “' + portfolioName + '” portfolio?'"
    no-click-animation
    okText="Archive portfolio"
    cancelText="Cancel"
    width="632"
    @ok="okClicked"
    @cancelClicked="cancelClicked"
    okButtonId="ArchiveButton_OK"
    cancelButtonId="ArchiveButton_Cancel"
  >
    <template #content>
      <div class="body">
        <p>
          After archiving, this portfolio will no longer appear in your ATAT 
          dashboard and funding reports.
        </p>
        <ul class="_atat-ul">
          <li>
            Your portfolio will become read-only, so you will no longer be able to add funding or
            team members.
          </li>
        </ul>
        <p>
          <strong>NOTE:</strong> Archiving will NOT remove your portfolio from {{csp}}’s console.
          To avoid incurring unexpected costs, we recommend that your administrators delete
          this workspace from the cloud console before you archive it in ATAT.
        </p>
      </div>
    </template>
  </ATATDialog>
</template>

<script lang="ts">
import ATATDialog from "@/components/ATATDialog.vue";
import Vue from "vue";
import { Component, Prop } from "vue-facing-decorator;

@Component({
  components: {
    ATATDialog
  }
})

export default class ArchivePortfolioModal extends Vue {
  @Prop({ default: false }) public showArchivePortfolioModal!: boolean;
  @Prop() public portfolioName!: string;
  @Prop() public csp!: string;

  public okClicked(): void {
    this.$emit('okClicked');
  }

  public cancelClicked(): void {
    this.$emit("cancelClicked");
  }
}

</script>
