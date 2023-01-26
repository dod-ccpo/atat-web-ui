<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col>
        <h1 class="page-header mb-0">
          Now, let’s add administrators to manage your CSP portal
        </h1>
        <p>
          Before we can start provisioning, you need to add at least one Cloud 
          Service Provider (CSP) administrator. These individuals will be granted 
          full access to your cloud resources within the !!!!![Azure portal]!!!!!!, enabling 
          them to manage user accounts and configure workspace settings. 
          <a
            role="button"
            id="CSPAdminLearnMore"
            class="_text-link"
            tabindex="0"
            @click="openSlideoutPanel"
            @keydown.enter="openSlideoutPanel"
            @keydown.space="openSlideoutPanel">
            Learn more about administrators
          </a>


          
        </p>

      
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

@Component({
  components: {
  
  }
})

export default class AddCSPAdmin extends Vue {

}

</script>
