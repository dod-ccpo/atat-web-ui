<template>
  <v-card class="package-item-card border-rounded-more">
    <v-list-item>
      <v-list-item-avatar>
        <span class="list-circle">{{itemNumber}}</span>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>
          <span class="text-wrap package-title">{{itemName}}</span>
        </v-list-item-title>
        <v-list-item-subtitle v-if="additionalInfo">
          <span class="font-size-14 font-weight-400 text-base-light">
            {{additionalInfo}}
          </span>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action v-if="requiresSignature">
        <span class="d-flex signature-required">
          <div class="d-flex align-center">
            <ATATSVGIcon
              class="mr-2"
              name="warning"
              width="18"
              height="15"
              color="warning-dark2"
            />
          <span>{{alertText}}</span>
          </div>
        </span>
      </v-list-item-action>
    </v-list-item>   
  </v-card>
</template>
<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

@Component({
  components: {
    ATATSVGIcon
  }
})
export default class PackageItem extends Vue {

  @Prop({default: "0"}) private itemNumber: string;
  @Prop({default: "Item"}) private itemName: string;
  @Prop({default: false}) private requiresSignature: boolean;
  @Prop({default: false}) private ditcoUser: boolean;
  @Prop({default: ""}) private additionalInfo: string;
  @Prop({default: ""}) private alertText: string;

}
</script>
