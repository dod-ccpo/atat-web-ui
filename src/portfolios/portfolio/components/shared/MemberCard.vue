<template>
  <div class="text-center">
    <v-menu
      :close-on-content-click="false"
      left
      open-on-hover
      offset-x
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-if="member.firstName"
          plain
          text
          v-bind="attrs"
          v-on="on"
          class="font-size-14 _profile-card__name-button"
        >
          {{member.firstName}} {{ member.lastName}}
        </v-btn>
        <v-btn
          v-else
          plain
          text
          v-bind="attrs"
          v-on="on"
          class="font-size-14 _profile-card__name-button"
        >
          {{member.email}}
        </v-btn>
      </template>

      <ATATProfileCard :person="member" />

    </v-menu>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { User } from "../../../../../types/Global";

import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATProfileCard from "@/components/ATATProfileCard.vue";
import PortfolioStore from "@/store/portfolio";

@Component({
  components: {
    ATATSVGIcon,
    ATATProfileCard,
  }
})

export default class MemberCard extends Vue {
  @Prop({required: true}) private index!:number;
  public member:User = {}

  public async mounted(): Promise<void> {
    const storeData = await PortfolioStore.getPortfolioData();
    if(storeData.members){
      this.member = storeData.members[this.index]
    }
  }
}
</script>
