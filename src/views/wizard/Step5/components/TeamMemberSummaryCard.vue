<template>
  <team-member-table :name="applicationData.name" :data="applicationData">
  </team-member-table>
</template>

<script lang="ts">
import Component from "vue-class-component";
import SummaryCard from "./SummaryCard.vue";
import TeamMemberTable from "@/views/wizard/Step5/components/TeamMemberTable.vue";
import { Prop } from "vue-property-decorator";
import { Application } from "../../../../../types/Portfolios";

@Component({
  components: {
    TeamMemberTable,
  },
})
export default class TeamMemberSummaryCard extends SummaryCard {
  @Prop({ default: {}, required: true })
  private applicationData!: Application;
}
</script>
