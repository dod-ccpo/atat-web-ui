<template>
  <v-card class="package-item-card _border-rounded-more">
    <v-list-item class="d-flex align-center">
      <v-avatar>
        <span class="list-circle">{{itemNumber}}</span>
      </v-avatar>
      <v-list-item-title class="ml-6 me-auto">
        <div class="text-wrap package-title">{{itemName}} </div>
        <div class="font-size-14 font-weight-400 text-base-light additional-info my-1">
          {{additionalInfo}}
        </div>
      </v-list-item-title>
      <v-list-item-subtitle v-if="additionalInfo">
        
      </v-list-item-subtitle>
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
import { Component, Prop, Vue, toNative } from "vue-facing-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

@Component({
  components: {
    ATATSVGIcon
  }
})
class PackageItem extends Vue {

  @Prop({default: "0"}) private itemNumber!: string;
  @Prop({default: "Item"}) private itemName!: string;
  @Prop({default: false}) private requiresSignature!: boolean;
  @Prop({default: false}) private ditcoUser!: boolean;
  @Prop({default: ""}) private additionalInfo!: string;
  @Prop({default: ""}) private alertText!: string;

}

export default toNative(PackageItem)
</script>
