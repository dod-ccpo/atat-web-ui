<template>
  <v-container fluid class="my-9 mb-10">
    <v-row>
      <v-col cols="8">
        <h2 class="h2">Your Task Order Summary</h2>
        <p class="my-3 body-lg">
          If you have more Task Orders, <strong>add</strong> them below. You can also 
          <strong>edit</strong> or <strong>delete</strong> any of the Task Orders you have already entered. 
          When you are done, click <strong>Next</strong> and we will walk you through adding 
          your applications and environments.
        </p>
        
      </v-col>
    </v-row>
    <v-row>
       <v-col>
             <v-btn class="v-btn primary" @click="$emit('addNewTaskOrder')">
            <v-icon class="mr-2" size="18">control_point</v-icon>
            <span class="body font-weight-bold">Add a Task Order</span>
        </v-btn>
       </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- <question-expand>
          <template v-slot:header>
            Can I add additional funding sources after my Portfolio is provisioned?
          </template>
        </question-expand> -->
      </v-col>
    </v-row>  
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import QuestionExpand from './QuestionExpand.vue';

@Component({
  components:{
    QuestionExpand,
  }
})
export default class TaskOrderSummary extends Vue {


}
</script>