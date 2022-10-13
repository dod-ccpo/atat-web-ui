<template>
  <ATATDialog
    id="AeletePackageModal"
    :showDialog.sync="_showModal"
    title="Archive this acquisition package?"
    no-click-animation
    okText="Archive"
    cancelText="Keep acquisition"
    width="450"
    @ok="okClicked"
    @cancelClicked="cancelClicked"
  >
    <template #content>
      <div v-if="waitingForSignature">
        <p v-if="!hasContributor" class="body">
          “{{packageName}}” will be moved to your archive. Your document signature request will be
          voided within DocuSign. You can restore it to a draft at any time.
        </p>
        <p v-else class="body">
          “{{packageName}}” will be moved to your archive. Your document signature request will be
          voided within DocuSign. Contributors will no longer have access to view or edit package
          details. You can restore it to a draft at any time.
        </p>
      </div>
      <div v-else>
        <p v-if="!hasContributor" class="body">
          “{{packageName}}” will be moved to your archive. You can restore it
          to a draft at any time.
        </p>
        <p v-else class="body">
          "{{ packageName }}"  will be moved to your archive. Contributors will no longer have
          access to view or edit package details. You can restore it to a draft at any time.
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

export default class ArchiveModal extends Vue {
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
