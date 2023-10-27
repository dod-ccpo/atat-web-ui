<template>
  <div class="text-center">
    <v-menu
      :close-on-content-click="false"
      location="left"
      open-on-hover
      offset
      v-if="member"
    >
      <template v-slot:activator="{ props }">
        <!-- TODO: check activator -->
        <v-btn
          variant="plain"
          v-bind="props"
          class="font-size-14 _profile-card__name-button"
        >
          <span v-if="member.firstName">
            {{member.firstName}} {{ member.lastName}}{{ getMemberTitle }}
          </span>
          <span v-else>
            {{member.email}}
          </span>
        </v-btn>
      </template>

      <ATATProfileCard :person="member" />

    </v-menu>
  </div>
</template>
<script lang="ts">

import { Component, Prop, Vue, toNative } from "vue-facing-decorator";
import { User } from "../../../../../types/Global";

import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATProfileCard from "@/components/ATATProfileCard.vue";

@Component({
  components: {
    ATATSVGIcon,
    ATATProfileCard,
  }
})

class MemberCard extends Vue {
  @Prop({required: true}) private member!: User;

  public get getMemberTitle(): string {
    if (this.member.title && this.member.title.trim().length > 0) {
      return ", " + this.member.title;
    }
    return "";
  }

}
export default MemberCard
</script>
