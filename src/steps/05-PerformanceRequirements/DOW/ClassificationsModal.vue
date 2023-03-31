<template>
  <ATATDialog
    id="UpdateClassificationsModal"
    :showDialog.sync="_showModal"
    title="What classification and impact level(s) are required 
      for your entire contracting effort?"
    no-click-animation
    okText="Change Levels"
    width="670"
    :OKDisabled="!hasChangedPackageClassificationLevels()"
    @ok="OKClicked"
    @cancelClicked="cancelClicked"
  >
    <template #content>
      <p class="body mb-5">
        Changes to the selections below will be reflected in the overall Classification
        Requirements section. If you select more than one, we will ask you to specify a
        level for each performance requirement.
      </p>
      <ATATCheckboxGroup
        id="ClassificationLevelCheckboxesModal"
        :value.sync="_modalSelectedOptions"
        :hasOtherValue="false"
        :items="modalCheckboxItems"
        name="checkboxes"
        :card="false"
        :truncate="false"
        :showPerformanceRequirementTotal="true"
        class="copy-max-width"
        :rules="[
          $validators.required('Please select at least one classification level.')
        ]"
      />
      <ATATAlert
        id="ClassificationRequirementsAlert"
        v-show="showClassificationRequirementsAlert"
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
       <ATATAlert
        id="TSSecretAlert"
        v-show="showTSSecretAlert"
        type="warning"
        class="copy-max-width mt-10"
      >
        <template v-slot:content>
          <p class="mb-0 body">
            Since CSP employees may access classified data, you’ll need to revisit the Contract 
            Details section to identify additional security requirements before 
            submitting this package.  
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
import ClassificationRequirements from '@/store/classificationRequirements';

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
  public selectedValue = "";
  public isItemAdded = false;
  public isTSSelected = false;

  @Watch("modalSelectedOptions")
  public async modalSelectedOptionsChange(updated: string[], current: string[]): Promise<void> {
    this.isItemAdded = updated.length>current.length;
    await this.setSelectedValue(updated,current);
    this._isIL6Selected =  updated.includes(
      ClassificationRequirements.classificationSecretSysId
    ) 
    this.isTSSelected = updated.includes(
      ClassificationRequirements.classificationTopSecretSysId
    )
  }

  public async setSelectedValue(
    updated: string[], 
    current: string[]
  ): Promise<void>{
    this.selectedValue = this.isItemAdded 
      ? updated.find(u=>current.indexOf(u)===-1) as string
      : current.find(c=>updated.indexOf(c)===-1) as string
  }

  get showTSSecretAlert(): boolean{
    /**ensure that when selected, the ts or secret checkbox  is 
     * not in the this.modalSelectionsOnOpen as the alert should 
     * display when ts or s is selected and not if either of those options
     * are in this.modalSelectionsOnOpen
     *  */

    return (this.isTSSelected && 
      this.modalSelectionsOnOpen.indexOf(
        ClassificationRequirements.classificationTopSecretSysId
      ) === -1) 
      ||  (this._isIL6Selected && 
      this.modalSelectionsOnOpen.indexOf(
        ClassificationRequirements.classificationSecretSysId
      ) === -1) as boolean
  }
  
  get showClassificationRequirementsAlert(): boolean{
    return (this._isIL6Selected && 
      this.modalSelectionsOnOpen.indexOf(
        ClassificationRequirements.classificationSecretSysId
      ) === -1) as boolean
  }

  private hasChangedPackageClassificationLevels(): boolean {
    const arr1 = [...this.modalSelectionsOnOpen].sort();
    const arr2 = [...this._modalSelectedOptions].sort();
    return !_.isEqual(arr1, arr2) && this._modalSelectedOptions.length !== 0;
  };

  public OKClicked(): void {
    this.cleanUp();
    this.$emit("okClicked");
  }

  public cancelClicked(): void {
    this.cleanUp();
    this._modalSelectedOptions = this.modalSelectionsOnOpen;
    this.$emit("cancelClicked");
  }

  public cleanUp(): void{
    this._showModal = false;
  }

 
}

</script>
