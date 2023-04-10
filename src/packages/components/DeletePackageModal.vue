<template>
  <ATATDialog
    :id="id"
    :showDialog.sync="_showModal"
    title="Delete this acquisition package?"
    buttonColor="error"
    no-click-animation
    okText="Delete permanently"
    cancelText="Keep acquisition"
    width="450"
    @ok="okClicked"
    @cancelClicked="cancelClicked"
    okButtonId="DeleteButton_OK"
    cancelButtonId="DeleteButton_Cancel"
  >
    <template #content>
      <div class="body">
        “{{packageName}}” will be permanently deleted.
        <span v-if="waitingForSignature">
          Your document signature request will be voided within DocuSign.
        </span>
        <span v-if="hasContributor">
          Contributors will no longer have access to view or edit package details.
        </span>
        Any details added to your package will not be saved.
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

export default class DeletePackageModal extends Vue {
  @PropSync("showModal") public _showModal?: boolean;
  @Prop() public packageName!: string;
  @Prop() public hasContributor!: boolean;
  @Prop() public waitingForSignature!: boolean;
  @Prop({ default: "DeletePackageModal"}) public id?: string;


  public okClicked(): void {
    this._showModal = false;
    this.$emit("okClicked");
  }

  public cancelClicked(): void {
    this._showModal = false;
  }

}

</script>
