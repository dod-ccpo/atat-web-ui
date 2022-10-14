<template>
  <ATATDialog
    id="DeletePackageModal"
    :showDialog.sync="_showModal"
    title="Delete this acquisition package?"
    buttonColor="error"
    no-click-animation
    okText="Delete permanently"
    cancelText="Keep acquisition"
    width="450"
    @ok="okClicked"
    @cancelClicked="cancelClicked"
  >
    <template #content>
      <div v-if="waitingForSignature">
        <p v-if="!hasContributor" class="body">
          “{{packageName}}” will be permanently deleted. Any details added to
          your package will not be saved.
        </p>
        <p v-else class="body">
          “{{packageName}}” will be permanently deleted. Your document signature request
          will be voided within DocuSign. Contributors will no longer have access to view
          or edit package details. Any details added to your package will not be saved.
        </p>
      </div>
      <div v-else>
        <p v-if="!hasContributor" class="body">
          “{{packageName}}” will be permanently deleted. Your document signature request will be
          voided within DocuSign. Any details added to your package will not be saved.
        </p>
        <p v-else class="body">
          "{{ packageName }}" will be permanently deleted. Contributors will no longer have access
          to view or edit package details. Any details added to your package will not be saved.
        </p>
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


  public okClicked(): void {
    this._showModal = false;
    this.$emit("okClicked");
  }

  public cancelClicked(): void {
    this._showModal = false;
  }

}

</script>
