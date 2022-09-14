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
          class="font-size-14 _member-button"
        >
          {{member.firstName}} {{ member.lastName}}
        </v-btn>
        <v-btn
          v-else
          plain
          text
          v-bind="attrs"
          v-on="on"
          class="font-size-14 _member-button"
        >
          {{member.email}}
        </v-btn>
      </template>

      <v-card class="_member-card">
        <v-list  v-if="member.firstName && member.lastName"
        >
          <v-list-item
            class="py-4 px-6"
          >
              <div class="_initials mr-2">
                {{ initials }}
              </div>
            <v-list-item-content class="ml-4">
              <v-list-item-title class="h3">
                {{member.firstName}} {{member.lastName}}
              </v-list-item-title>
              <v-list-item-title class="font-size-14">{{member.title}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <hr class="my-0" />
        </v-list>
        <v-list>
          <v-list-item
            class="px-6"
            :class="[member.phoneNumber? 'py-4': 'py-0']"
          >
            <v-list-item-content>
              <div class="d-flex align-center ">
                <ATATSVGIcon
                  width="16"
                  height="13"
                  name="email"
                  color="base-light"
                />
                <a
                  class="font-size-14 ml-3"
                  :href="$sanitize('mailto:'+ member.email)"
                >
                  {{member.email}}
                </a>
              </div>
              <div
                class="d-flex align-center mt-3"
                v-if="member.phoneNumber"
              >
                <ATATSVGIcon
                  width="16"
                  height="13"
                  name="phone"
                  color="base-light"
                />
                <span class="font-size-14 ml-3">
                  {{formattedPhone}}
                </span>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import { User } from "../../../types/Global";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import PortfolioData from "@/store/portfolio";
@Component({
  components: {
    ATATSVGIcon
  }
})
export default class MemberCard extends Vue {
  @Prop({required: true}) private index!:number;
  public member:User = {}
  public initials = ""
  public formattedPhone = ""

  public getUserInitials(member:User): string {
    const firstI = member.firstName?.charAt(0);
    const lastI = member.lastName?.charAt(0);
    const initials = firstI && lastI
      ? firstI + lastI
      : "XX";
    return initials.toUpperCase();
  }

  public formatPhoneNumber(member:User): string {
    const phoneNumberString = member?.phoneNumber
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return "";
  }
  public async mounted(): Promise<void> {
    const storeData = await PortfolioData.getPortfolioData();
    if(storeData.members){
      this.member = storeData.members[this.index]
      this.initials = this.getUserInitials(this.member)
      this.formattedPhone = this.formatPhoneNumber(this.member)

    }
  }
}
</script>
