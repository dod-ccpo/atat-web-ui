<template>
  <div>
    <section id="SectionCards" class="container-max-width mx-auto _mt-80 _mb-80">
      <div class="_new-user-cards d-flex">
        <NewAcquisitionCard />
      </div>
    </section>

    <section id="SectionPreparePackage" class="bg-base-lightest _py-80">
      <div class="container-max-width">
        <h2>Prepare your acquisition package online</h2>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import NewAcquisitionCard from "./components/NewAcquisitionCard.vue";

@Component({
  components: {
    NewAcquisitionCard,
  }
})

export default class NewUser extends Vue {}

</script>
