<template>
  <div class="_comment-button">
    <v-btn 
      :id="id + '_CommentButton'"
      class="_icon-only"
      @click="addComment"
    >
      <ATATSVGIcon
        name="commentBubble"
        class="comment-icon"
        width="18"
        height="18"
        color="base"
      />
    </v-btn>
  </div> 
</template>

<script lang="ts">
import { Component, Prop, Vue, toNative } from "vue-facing-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

@Component({
  components: {
    ATATSVGIcon,
  },
})

class CommentButton extends Vue {
  @Prop() private id!: string;
  public addComment(): void {
    // future ticket show dialog with comment input
  }
}
export default CommentButton;
</script>
