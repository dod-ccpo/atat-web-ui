<template>
  <div id="CommentsDiv" class="" ref="CommentsPanel">
    <div class="content-header">
      <v-btn color="primary" class="d-flex align-center" id="inReviewButton">
        <div class="d-flex align-center">
          In review

          <ATATSVGIcon
            name="ChevronDown"
            color="white"
            class="ml-3"
            :width="10"
            :height="6.17"
          />
        </div>
      </v-btn>
      <v-btn 
        @click="$emit('showView', 'preview')" 
        class="link-button no-hover mt-3">
        Preview Form
        <ATATSVGIcon
          class="ml-2"
          name="launch"
          width="15"
          height="15"
          color="primary"
        />
      </v-btn>
    </div>
    <hr class="ma-0" />
    <div class="content-comments">
      <h3 class="mb-4">Comments</h3>
      <dl>
        <dt>
          <v-btn text x-small class="pa-2 comment-button">
            <ATATSVGIcon
              name="commentBubble"
              class="comment-icon"
              width="18"
              height="18"
              color="base"
            />
          </v-btn>
        </dt>
        <dd class="body-sm">
          Share your feedback or ask a question by hovering over a field and
          clicking the <strong>Comment icon</strong>.
        </dd>
      </dl>
    </div>
    <hr class="ma-0" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

@Component({
  components: {
    ATATSVGIcon,
  },
})
export default class CommentsPanel extends Vue {}
</script>
