<template>
  <ATATDialog
    :showDialog.sync="_showModal"
    title="What classification level(s) are required for your
      cloud resources and/or services?"
    no-click-animation
    okText="Change Levels"
    width="670"
    :OKDisabled="!hasChangedPackageClassificationLevels()"
    @ok="OKClicked"
    @cancelClicked="cancelClicked"
  >
    <template #content>
      <p class="body">
        Changes to the selections below will be reflected in the overall Classification
        Requirements section. If you select more than one, we will ask you to specify a
        level for each performance requirement.
      </p>
      <p class="body mb-5">
        Select all that apply to your contracting effort.
      </p>
      <ATATCheckboxGroup
        id="ClassificationLevelCheckboxesModal"
        :value.sync="_modalSelectedOptions"
        :hasOtherValue="false"
        :items="modalCheckboxItems"
        name="checkboxes"
        :card="false"
        :truncate="false"
        class="copy-max-width"
        :rules="[
          $validators.required('Please select at least one classification level.')
        ]"
      />
      <ATATAlert
        id="ClassificationRequirementsAlert"
        v-show="_isIL6Selected === true"
        type="warning"
        class="copy-max-width mt-10"
      >
        <template v-slot:content>
          <p class="mb-0 body">
            Contracts requiring access to classified information (IL6 level and above)
            must complete a <strong>DD Form 254, DoD Contract Security Classification
            Specification.</strong> We will walk you through uploading this form next.
          </p>
        </template>
      </ATATAlert>
    </template>
  </ATATDialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";

import ATATAlert from "@/components/ATATAlert.vue";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATDialog from "@/components/ATATDialog.vue";

import { Checkbox } from "../../../../types/Global";
import _ from "lodash";

@Component({
  components: {
    ATATAlert,
    ATATCheckboxGroup,
    ATATDialog,
  }
})

export default class ClassificationsModal extends Vue {
  @Prop({ required: true }) public modalCheckboxItems!: Checkbox[];
  @Prop({ required: false }) public IL6SysId?: string;
  @Prop( { required: true }) public modalSelectionsOnOpen!: string[];
  @PropSync("modalSelectedOptions") public _modalSelectedOptions!: string[];
  @PropSync("isIL6Selected") public _isIL6Selected?: boolean;
  @PropSync("showDialog") public _showModal?: boolean;
  
  @Watch("modalSelectedOptions")
  public modalSelectedOptionsChange(newVal: string[]): void {
    if (this.IL6SysId) {
      this._isIL6Selected = newVal.indexOf(this.IL6SysId) > -1 ? true : false;
    }
  };

  private hasChangedPackageClassificationLevels(): boolean {
    const arr1 = [...this.modalSelectionsOnOpen].sort();
    const arr2 = [...this._modalSelectedOptions].sort();
    return !_.isEqual(arr1, arr2) && this._modalSelectedOptions.length !== 0;
  };

  public OKClicked(): void {
    this._showModal = false;
    this.$emit("okClicked");
  }

  public cancelClicked(): void {
    this._showModal = false;
    this._modalSelectedOptions = this.modalSelectionsOnOpen;
    this.$emit("cancelClicked");
  }
}

</script>
