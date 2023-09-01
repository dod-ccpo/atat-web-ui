<template>
  <ATATDialog 
    id="TOSearchModal"
    :showDialog.sync="_showTOSearchModal"
    :title="titleText"
    no-click-animation
    :hideOkButton="true"
    width="632"
    @cancelClicked="TOSearchCancelled"
    cancelButtonId="TOSearchCancel"
    
  >
    <template #content>
      <div class="body">
        <p>
          {{ bodyText }}
        </p>
        <TaskOrderSearch 
          label="Task order number"
          tooltipText="This is a 13-character alphanumeric value found on your 
            awarded task order. You may also enter 19 characters for a task order 
            modification. Depending on which form was used, this may be referred 
            to as the “Order Number” or “Delivery Order/Call No.”"
          @startProvisionWorkflow="startProvisionWorkflow"
          :TONumber.sync="_TONumber"
          :resetValidationNow.sync="_resetValidationNow"
          :isModal="true"
        />

      </div>
    </template>
  </ATATDialog>  
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync, Watch } from "vue-property-decorator";
import PortfolioStore from "@/store/portfolio";
import ATATDialog from "@/components/ATATDialog.vue";
import TaskOrderSearch from "@/portfolios/components/TaskOrderSearch.vue";

@Component({
  components: {
    ATATDialog,
    TaskOrderSearch,
  },
})
export default class TaskOrderSearchModal extends Vue {

  @PropSync("showTOSearchModal") public _showTOSearchModal!: boolean;
  @PropSync("TONumber") public _TONumber?: string;
  @PropSync("resetValidationNow") public _resetValidationNow!: boolean;

  public isFollowOn = false;
  public defaultBody = `To fund your ATAT portfolio, you will need an awarded task order. Enter 
          your task order number and we'll retrieve the funding information.`;
  public bodyText = this.defaultBody;
  public defaultTitle = "Search for your task order";
  public titleText = this.defaultTitle;

  public async startProvisionWorkflow(): Promise<void> {
    this.$emit("startProvisionWorkflow");
  }

  public async TOSearchCancelled(): Promise<void> {
    this.$emit("TOSearchCancelled");
  }
  public get isTOFollowOn(): boolean {
    return PortfolioStore.isProvisioningTOFollowOn;
  }
  @Watch("isTOFollowOn")
  public isTOFollowOnChanged(newVal: boolean) {
    if (newVal) {
      this.bodyText = `To update funding associated with your ATAT portfolio, you will need an
      awarded modification or follow-on task order. Enter your task order number and we'll retrieve
      the funding information.`
      this.titleText = "Search for your modification or follow-on task order"
    } else {
      this.bodyText = this.defaultBody;
      this.titleText = this.defaultTitle;
    }
  }
}
</script>
