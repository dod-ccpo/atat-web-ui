<template>
  <div>
    <div v-for="application in applicationData" :key="application.id">
      <div class="review-table">
        <v-card class="v-card ma-9 px-2 ml-0 body">
          <v-card-title>
            <div class="width-100 d-flex justify-space-between align-center">
              <h3>{{ application.name }}</h3>
              <v-btn
                class="py-0 px-2 primary--text"
                text
                small
                @click="onEdit(application.id)"
                :ripple="false"
                ><v-icon aria-hidden="true" small class="icon-12 mr-2">edit</v-icon>
                <span class="link-body-md">Edit</span></v-btn
              >
            </div>
            <p class="body-lg width-80 word-break-normal">
              {{ application.description }}
            </p>
          </v-card-title>
          <v-card-text class="body-lg text--base-darkest">
            <div
              class="
                text--base
                font-weight-bold
                mt-0
                d-flex
                justify-start
                black--text
              "
            >
              <div>ENVIRONMENTS</div>
            </div>
            <div class="body-lg d-flex justify-start black--text grouped-items">
              <div
                class="mx-3"
                v-for="environment in application.environments"
                :key="environment.name"
              >
                {{ environment.name }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import SummaryCard from "./SummaryCard.vue";
import { Prop } from "vue-property-decorator";
import { ApplicationModel } from "../../../../types/Portfolios";
import { editapplication } from "@/router/wizard";

@Component({})
export default class ApplicationsEnvironmentsSummaryCard extends SummaryCard {
  @Prop({ default: {}, required: true })
  private applicationData!: ApplicationModel[];

  public onEdit(id: string): void {
    this.$store.dispatch("editApplication", id);
    this.$router.push({
      name: editapplication.name,
      params: {
        id: id,
      },
    });
  }
}
</script>
