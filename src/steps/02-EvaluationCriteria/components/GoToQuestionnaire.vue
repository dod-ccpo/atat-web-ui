<template>
  <ATATExpandableLink  aria-id="HelpReturnToQuestionnaire"
                       class="mt-5">
    <template v-slot:header>
      I need help generating a response for this portion of the J&A. What do I do?
    </template>
    <template v-slot:content>
      <p class="copy-max-width">
        DAPPS can provide suggested language for {{ forWhat }},
        based on your responses to a short questionnaire. You’ll be able to edit our
        suggestion to meet your requirements, if needed.
      </p>
      <v-btn
        class="_secondary font-size-14 px-3 mb-1 mt-1"
        id="GoToQuestionnaireBtn"
        @click="goToQuestionnaire"
        @keydown.enter="goToQuestionnaire"
        @keydown.space="goToQuestionnaire"

      >
        <ATATSVGIcon
          id="FillOutQuestionnaireButtonIcon"
          width="19"
          height="15"
          name="dynamicForm"
          class="mr-1"
          color="primary"
        />
        Fill out the questionnaire
      </v-btn>
    </template>
  </ATATExpandableLink>
</template>

<script lang="ts">
 
import { Component, Prop, Vue, toNative } from "vue-facing-decorator";

import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATExpandableLink from "@/components/ATATExpandableLink.vue"

@Component({
  components: {
    ATATSVGIcon,
    ATATExpandableLink,
  }
})

class GoToQuestionnaire extends Vue {
  @Prop() private section!: "soleSource" | "researchDetails" | "plansToRemoveBarriers";

  public get forWhat(): string {
    switch (this.section) {
    case "soleSource":
      return "the cause of your sole source situation";
    case "researchDetails":
      return "the market research conducted";
    case "plansToRemoveBarriers":
      return "removing barriers to fair opportunity"
    }
    return "";
  }

  public goToQuestionnaire(): void {
    this.$emit("goToQuestionnaire");
  }
}
export default toNative(GoToQuestionnaire )
</script>
