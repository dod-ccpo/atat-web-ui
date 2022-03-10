<template>
  <div>

    <section id="COR_Intro" v-if="!isACOR">
      <h1 class="page-header" id="COR_Header">
        Let’s gather info about your Contracting Officer’s Representative (COR)
      </h1>
      <p class="page-intro">
        Your COR is an important part of your acquisition
        approval process. We will fill out your COR’s contact information on any necessary forms
        and will send your COR an email when documents are ready to be signed. Search for your COR
        below or manually enter their contact information. For more guidance about CORs, visit
        <a href="https://www.ditco.disa.mil/hq/cor/index.asp" class="text-link" target="_blank">
          https://www.ditco.disa.mil/hq/cor/index.asp<span class="external-link">.</span>
        </a>
      </p>
    </section>

    <section id="ACOR_Intro" v-if="isACOR">
      put ACOR header and intro p here
    </section>

  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class Intro extends Vue {
  @Prop({ default: false }) private isACOR!: boolean;
}

</script>