<template>
  <ATATDialog
    id="UpdateClassificationsModal"
    :showDialog="_showRestoreModal"
    title="Restore to suggestion?"
    no-click-animation
    okText="Restore"
    width="470"
    @ok="okClicked"
    @cancelClicked="cancelClicked"
  >
    <template #content>
      <p class="body mb-5">
        Your description will be reverted to the default suggested 
        language{{ getBasedOnResponses }}.
        Any changes that you made to this field will not be saved.
      </p>
    </template>
  </ATATDialog>
</template>

<script lang="ts">
 
import { Component, Prop, Vue, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom"
import ATATDialog from "@/components/ATATDialog.vue";

@Component({
  components: {
    ATATDialog
  }
})

class ConfirmRestoreDefaultTextModal extends Vue {
  @PropSync("showRestoreModal", { default: false }) public _showRestoreModal?:boolean;
  @Prop({ default: false }) public isBasedOnResponses?: boolean;
  
  public okClicked(): void {
    this.$emit("okRestore")
  }

  public cancelClicked(): void {
    this.$emit("cancelRestore");
    this._showRestoreModal = false;
  }

  public get getBasedOnResponses(): string {
    return this.isBasedOnResponses 
      ? " based on your responses to the previous questionnaire" : "";
  }


}

export default toNative(ConfirmRestoreDefaultTextModal)
</script>
