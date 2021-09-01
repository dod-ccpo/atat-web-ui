<template>
  <summary-card :title="title" :items="items">
    <template slot="summary-description">
      <p class="body-lg width-80 word-break-normal">
        {{ description }}
      </p>
    </template>

    <template slot="summary-body">
      <div
        class="body-lg d-flex justify-start black--text grouped-items"
        v-for="(item, idx) in items"
        :key="idx"
      >
        <div class="mx-3">
          <strong>{{ item.prefix }}</strong>
        </div>
        <div class="">
          {{ item.value }}
        </div>
      </div>
    </template>
  </summary-card>
</template>

<script lang="ts">
import Component from "vue-class-component";
import SummaryCard from "./SummaryCard.vue";

@Component({})
export default class ApplicationsEnvironmentsSummaryCard extends SummaryCard {}
</script>
