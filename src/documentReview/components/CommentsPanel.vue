<template>
  <div>
    <div id="CommentsDiv" class="ml-auto">
    <v-btn 
    color="primary" 
    class="ml-4 d-flex align-center"
    id="inReviewButton">
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
        class="link-button mt-3">
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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";



@Component({
  components: {
    
  }
})
export default class CommentsPanel extends Vue {}
</script>
