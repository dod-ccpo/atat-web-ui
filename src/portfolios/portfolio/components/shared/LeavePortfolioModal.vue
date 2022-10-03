<template>
  <ATATDialog
  id="LeavePortfolioModal"
  :showDialog.sync="_showModal"
  :title="'Leave “' + portfolioName + '” portfolio?'" 
  no-click-animation
  okText="Leave portfolio"
  width="450"
  @ok="okClicked"
  @cancelClicked="cancelClicked"
>    
  <template #content>
    <p class="body">
      You will no longer have access to edit portfolio details or track funds spent 
      for this portfolio.
    </p>
    <p class="body">
      NOTE: A portfolio manager can restore your access to this portfolio at any time.
    </p>
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

export default class LeavePortfolioModal extends Vue {
  @PropSync("showModal") public _showModal?: boolean;
  @Prop() public portfolioName!: string;

  public okClicked(): void {
    this._showModal = false;
    this.$emit("okClicked");
  }

  public cancelClicked(): void {
    this._showModal = false;
  }

}

</script>
