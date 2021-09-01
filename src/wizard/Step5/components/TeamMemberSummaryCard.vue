<template>
  <review-table :application="application" @edit="onEdit"></review-table>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";
import ReviewTable from "./ReviewTable.vue";

import { Application, ApplicationMember } from "types/Portfolios";

@Component({
  components: {
    ReviewTable,
  },
})
export default class TeamMemberSummaryCard extends Vue {
  @Prop({ default: null }) private application!: Application;

  get applicationMembers(): Array<ApplicationMember> | undefined {
    return this.application ? this.application.members : [];
  }

  get summaryTitle(): string {
    return this.application ? this.application.name : "";
  }

  public onEdit() {
    //todo: take to review
  }
}
</script>
