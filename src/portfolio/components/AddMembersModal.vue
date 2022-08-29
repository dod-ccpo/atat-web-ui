
<template>

  <ATATDialog
    :showDialog.sync="showModal"
    :title="'Invite people to “' + projectTitle + '”'"
    no-click-animation
    okText="Invite"
    width="632"
    :OKDisabled="true"
  >
    <template #content>
      <p class="body">
        Use “.mil” or “.gov” email addresses to ensure people can authenticate with 
        a CAC to access your portfolio. 
        <a
          id="LearnMoreLink" 
          role="button"
        >
          Learn more about portfolio roles
        </a>
      </p>
      <ATATTextArea
        id="EmailAddresses"
        label="Email addresses"
        rows="7"
        class="pb-16"
      />
    </template>
  </ATATDialog>

</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import AcquisitionPackage from "@/store/acquisitionPackage";

import ATATDialog from "@/components/ATATDialog.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";

@Component({
  components: {
    ATATDialog,
    ATATTextArea,
  }
})

export default class AddMembersModal extends Vue {
  @Prop({ default: false }) public showModal?: boolean;

  public get projectTitle(): string {
    return AcquisitionPackage.projectTitle !== ""
      ? AcquisitionPackage.projectTitle
      : "New Acquisition";
  }

}
</script>
