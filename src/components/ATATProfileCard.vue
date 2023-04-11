<template>
  <v-card class="_profile-card">
    <v-list  v-if="person.fullName">
      <v-list-item class="py-4 px-6">
          <div class="_initials mr-2">
            {{ initials }}
          </div>
        <v-list-item-content class="ml-4">
          <v-list-item-title class="h3">
            {{person.fullName}}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <hr class="my-0" />
    </v-list>
    <v-list>
      <v-list-item class="px-6 py-6">
        <v-list-item-content>
          <div class="d-flex align-center">
            <ATATSVGIcon
              width="16"
              height="13"
              name="email"
              color="base-light"
            />
            <a
              class="font-size-14 ml-3"
              :href="emailLink"
            >
              {{person.email}}
            </a>
          </div>
          <div
            class="d-flex align-top mt-3"
            v-if="hasPhone"
          >
            <ATATSVGIcon
              width="16"
              height="13"
              name="phone"
              color="base-light"
            />
            <div>
              <div v-if="person.officePhone" class="d-flex align-center mb-1">
                <span class="font-size-14 ml-3">
                  {{formatPhoneNumber(person.officePhone)}}
                </span>
                <span class="pl-4 font-size-14">
                  Office
                </span>
              </div>

              <div v-if="person.mobilePhone" class="d-flex align-center mb-1">
                <span class="font-size-14 ml-3">
                  {{formatPhoneNumber(person.mobilePhone)}}
                </span>
                <span class="pl-4 font-size-14">
                  Mobile
                </span>
              </div>

              <div v-if="person.dsnPhone" class="d-flex align-center mb-1">
                <span class="font-size-14 ml-3">
                  {{formatPhoneNumber(person.dsnPhone)}}
                </span>
                <span class="pl-4 font-size-14">
                  DSN
                </span>
              </div>

            </div>
          </div>

          <div
            class="d-flex align-center"
            :class="agencyClass"
            v-if="person.agency"
          >
            <ATATSVGIcon
              width="16"
              height="16"
              name="service"
              color="base-light"
            />
            <span class="font-size-14 ml-3">
              {{person.agency}}
            </span>
          </div>

          <div
            class="d-flex align-center"
            :class="designationClass"
            v-if="person.designation"
          >
            <ATATSVGIcon
              width="16"
              height="16"
              name="role"
              color="base-light"
            />
            <span class="font-size-14 ml-3">
              {{person.designation}}
            </span>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>

</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { User } from "../../types/Global";
import { getUserInitials } from "../helpers";

@Component({
  components: {
    ATATSVGIcon,
    ATATProfileCard,
  }
})

export default class ATATProfileCard extends Vue {
  @Prop({required: true}) public person!: User;
  public initials = ""
  public emailLink = ""

  public getUserInitials(member:User): string {
    return getUserInitials(member)
  }

  public formatPhoneNumber(phone: string): string {
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return "";
  }

  public get hasPhone(): boolean {
    return !!this.person.officePhone || !!this.person.mobilePhone || !!this.person.dsnPhone;
  }

  public get agencyClass(): string {
    return this.hasPhone ? 'mt-2': 'mt-3'
  }

  public get designationClass(): string {
    return this.hasPhone && !this.person.agency ? 'mt-2': 'mt-3'
  }

  public phoneNumbers: Record<string, string>[] = []

  public async mounted(): Promise<void> {
    this.initials = this.getUserInitials(this.person);
    this.emailLink = `mailto:${this.person.email}`;
  }

}

</script>
