<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        
      </div>

      <v-spacer></v-spacer>

    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
    <Footer />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Footer from './components/Footer.vue';


export default Vue.extend({
  name: 'App',
  components: {
    Footer,
  },
  data: () => {
    //
    return {};
  },
});
</script>