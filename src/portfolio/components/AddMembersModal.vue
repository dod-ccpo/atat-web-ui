
<template>

  <ATATDialog
    :showDialog.sync="_showModal"
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
      <div class="d-flex">
        <div style="flex-grow: 1;" class="mr-5">
          <ATATTextArea
            id="EmailAddresses"
            label="Email addresses"
            rows="7"
            class="pb-16"
          />
        </div>
        <div>
          <ATATSelect
            id="Role"
            class="mt-8 _small _alt-style _invite-members-modal"
            :items="roles"
            width="105"
            :selectedValue.sync="selectedRole"
            iconType="chevron"
          />
        </div>

      </div>
    </template>
  </ATATDialog>

</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop, PropSync } from "vue-property-decorator";
import AcquisitionPackage from "@/store/acquisitionPackage";

import ATATDialog from "@/components/ATATDialog.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";

import { SelectData } from "../../../types/Global";

@Component({
  components: {
    ATATDialog,
    ATATSelect,
    ATATTextArea,
  }
})

export default class AddMembersModal extends Vue {
  @PropSync('showModal') public _showModal?: boolean;

  public get projectTitle(): string {
    return AcquisitionPackage.projectTitle !== ""
      ? AcquisitionPackage.projectTitle
      : "New Acquisition";
  }

  public selectedRole = "Manager";
  public roles: SelectData[] = [
    { header: "Roles" },
    { text: "Manager", value: "Manager" },
    { text: "Viewer", value: "Viewer" },
  ];


}
</script>
