<template>
  <summary-card :title="title" :items="items">
    <template slot="summary-description">
      <p class="body width-80">
        {{ description }}
      </p>
    </template>

    <template slot="summary-body">
      <table
        class="
          body-lg
          black--text
          border-0 border-solid border-l-4 border-accent-cool
          pl-2
          width-60
        "
      >
        <tr v-for="(item, idx) in items" :key="idx">
          <td v-if="item.value" class="pr-4">
            <strong>{{ item.prefix }}</strong>
          </td>
          <td class="text-left" v-if="item.value">
            {{ item.value }}
          </td>
        </tr>
      </table>
    </template>
  </summary-card>
</template>

<script lang="ts">
import Component from "vue-class-component";
import SummaryCard from "./SummaryCard.vue";

@Component({})
export default class PortfolioSummaryCard extends SummaryCard {}
</script>
