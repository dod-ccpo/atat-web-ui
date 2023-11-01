<template>
  <ATATDialog
  id="LeavePortfolioModal"
  :showDialog.sync="_showModal"
  :title="'Leave “' + portfolioName + '” portfolio?'" 
  no-click-animation
  okText="Leave portfolio"
  width="450"
  :showOKSpinner="showLeaveModalSpinner"
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
import { Component, Prop, Vue, toNative } from "vue-facing-decorator";
import { PropSync } from '@/decorators/custom'

@Component({
  components: {
    ATATDialog
  }
})

class LeavePortfolioModal extends Vue {
  @PropSync("showModal") public _showModal?: boolean;
  @Prop() public portfolioName!: string;
  @Prop() public showLeaveModalSpinner!: boolean;

  public okClicked(): void {
    this._showModal = false;
    this.$emit("okClicked");
  }

  public cancelClicked(): void {
    this._showModal = false;
    this.$emit("cancelClicked");
  }

}
export default toNative(LeavePortfolioModal)
</script>
