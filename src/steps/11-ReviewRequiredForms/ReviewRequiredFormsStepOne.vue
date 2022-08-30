
<template>
  <div>
    Future Review Required Forms page
    <p class="my-10">
      <a 
        role="button"
        @click="openModal"
      >      
        Temporary open "Invite Members" modal link
      </a>
    </p>

    <AddMembersModal 
      :showModal.sync="showModal"
    />

  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";

import AddMembersModal from "@/portfolio/components/AddMembersModal.vue";

@Component({
  components: {
    AddMembersModal,
  }
})
export default class ReviewRequiredFormsStepOne extends Vue {
  public showModal = false;

  public openModal(): void {
    this.showModal = true;
  }
}
</script>

