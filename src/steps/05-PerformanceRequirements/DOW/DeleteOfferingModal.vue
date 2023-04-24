<template>
  <ATATDialog
    id="DeleteOfferingModal"
    :showDialog.sync="_showModal"
    :title="title"
    no-click-animation
    :okText="okText"
    width="450"
    @ok="OKClicked"
    @cancelClicked="cancelClicked"
  >
    <template #content>
      <p class="body">
        {{bodyContent}}
      </p>
    </template>
  </ATATDialog>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";

import ATATDialog from "@/components/ATATDialog.vue";

@Component({
  components: {
    ATATDialog,
  }
})
export default class DeleteOfferingModal extends Vue {
  @PropSync("showDialog") public _showModal?: boolean;
  @Prop({default: "[category title]"}) private requirementName!: string;
  @Prop({default: "[offering deselected]"}) private offeringName?: string;
  @PropSync("deleteMode", {default: "item"}) private _deleteMode?: string;

  public title = "";
  public okText = "";
  public bodyContent = "";

  @Watch("requirementName")
  public requirementNameChanged(): void {
    this.updateModalContent();
  }
  @Watch("offeringName")
  public offeringNameChanged(): void {
    this.updateModalContent();
  }

  @Watch("deleteMode")
  modeChanged(): void {
    this.updateModalContent();
  }

  public updateModalContent(): void {
    if(this._deleteMode === "item") {
      this.title = "Delete " + this.offeringName + "?";
      this.bodyContent = `This requirement will be removed from your 
        ${this.requirementName} requirements.
        Any details about this requirement will not be saved.`;
      this.okText = "Delete requirement";
    } else {
      this.title = "Delete all requirements in this category?";
      this.bodyContent = `This action will remove the “${this.requirementName}” category
        from your performance requirements. Any details about your requirements
        will not be saved.`;
      this.okText = "Delete all requirements";
    }
  }

  public async mounted(): Promise<void> {
    this.modeChanged();
  }

  public OKClicked(): void {
    this.$emit("deleteOfferingOkClicked");
  }

  public cancelClicked(): void {
    this.$emit("deleteOfferingCancelClicked");
  }
}
</script>