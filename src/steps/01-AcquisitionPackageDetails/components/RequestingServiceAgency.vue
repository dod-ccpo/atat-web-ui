<template>
  <ATATAutoComplete
          id="ServiceOrAgency"
          class="_input-max-width mb-2"
          label="What service or agency do you work for?"
          :label-sr-only="false"
          titleKey="text"
          :searchFields="['text']"
          :items="serviceOrAgencyData"
          :selectedItem.sync="selectedServiceOrAgency"
          :rules="[$validators.required('Please select your service or agency.')]"
          placeholder="Find your service/agency"
          icon="arrow_drop_down"
        />
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component} from "vue-property-decorator";
import Vue from "vue";
import ATATAutoComplete from "@/components/ATATAutoComplete.vue";

@Component({
  components: {
    ATATAutoComplete
  },
})

export default class RequestingServiceAgency extends Vue {


}
</script>