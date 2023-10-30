<template>
  <div id="HelpfulResourcesCards" class="_resources">
    <div class="container-max-width">
      <h3 class="mb-5 large">Helpful Resources</h3>
      <v-row>
        <v-col>
          <v-card flat id="Card1">
            <span class="h3">JWCC</span>
            <p>Short description of the resource topic</p> 
          </v-card>
        </v-col>
        <v-col>
          <v-card flat id="Card2">
            <span class="h3">DAPPS</span>
            <p>Short description of the resource topic</p> 
          </v-card>
        </v-col>
        <v-col>
          <v-card flat id="Card3">
            <span class="h3">ATAT</span>
            <p>Short description of the resource topic</p> 
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
@Component({})

class HelpfulResourcesCards extends Vue {}
export default HelpfulResourcesCards;
</script>
