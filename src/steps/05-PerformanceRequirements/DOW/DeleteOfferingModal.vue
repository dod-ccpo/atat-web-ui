<template>
  <ATATDialog
    id="DeleteOfferingModal"
    :showDialog.sync="_showModal"
    :title="title"
    no-click-animation
    :okText="okText"
    width="670"
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
  @Prop({default: "[category title]"}) public requirementName!: string;
  @Prop({default: "[offering deselected]"}) public offeringName?: string;
  @PropSync("deleteMode", {default: "item"}) public _deleteMode?: string;

  public title = "";
  public okText = "";
  public bodyContent = "";

  @Watch("deleteMode")
  modeChanged(): void {
    if(this._deleteMode === "item"){
      this.title = "Delete " + this.offeringName + "?";
      this.bodyContent = `This requirement will be removed from your 
        ${this.requirementName} requirements.
        Any details about this requirement will not be saved.`;
      this.okText = "Delete requirement";
    } else {
      this.title = "Delete all requirements in this category?";
      this.bodyContent = `This action will remove the ${this.requirementName} category
        from your performance requirements. Any details about your requirements
        will not be saved.`;
      this.okText = "Delete requirement";
    }
  }

  public async mounted(): Promise<void> {
    this.modeChanged();
  }

  public OKClicked(): void {
    this._showModal = false;
    this.$emit("deleteOfferingOkClicked");
  }

  public cancelClicked(): void {
    this._showModal = false;
    this.$emit("deleteOfferingCancelClicked");
  }
}
</script>