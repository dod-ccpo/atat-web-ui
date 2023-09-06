<template>
  <div>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header mb-1 py-0">
            Is this task order intended to fund one of your existing portfolios?
          </h1>
        
          <div class="copy-max-width">
            <p>
              Select on of your portfolios below and we will add your task order to it to continue
              funding. If this task order is for a new requirement, click "I need a new portfolio"
              button.
            </p>
          </div>
        </v-col>
      </v-row>

    </v-container>  

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

@Component({
  components:{
 
  }
})
export default class AddToExisitingPortfolio extends Vue {


  public async mounted(): Promise<void> {

  }

}
</script>
