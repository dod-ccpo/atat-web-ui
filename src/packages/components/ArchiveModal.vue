<template>
  <ATATDialog
    :id="id"
    :showDialog.sync="_showModal"
    title="Archive this acquisition package?"
    no-click-animation
    okText="Archive"
    cancelText="Keep acquisition"
    width="450"
    @ok="okClicked"
    @cancelClicked="cancelClicked"
    okButtonId="ArchiveButton_OK"
    cancelButtonId="ArchiveButton_Cancel"
  >
    <template #content>
      <div class="body">
        “{{packageName}}” will be moved to your archive.
        <span v-if="waitingForSignature">
          Your document signature request will be voided within DocuSign.
        </span>
        <span v-if="hasContributor">
          Contributors will no longer have access to view or edit package details.
        </span>
        You can restore it to a draft at any time.
      </div>
    </template>
  </ATATDialog>

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom";
import ATATDialog from "@/components/ATATDialog.vue";

@Component({
  components: {
    ATATDialog
  }
})

class ArchiveModal extends Vue {
  @PropSync("showModal") public _showModal?: boolean;
  @Prop() public packageName!: string;
  @Prop() public hasContributor!: boolean;
  @Prop() public waitingForSignature!: boolean;
  @Prop({ default: "ArchivePackageModal"}) public id?: string;


  public okClicked(): void {
    this._showModal = false;
    this.$emit("okClicked");
  }

  public cancelClicked(): void {
    this._showModal = false;
  }
}

export default ArchiveModal;

</script>
