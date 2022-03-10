<template>
  <nav class="stepper-nav container-max-width">
    <hr class="base-lighter ml-3 mt-10 mb-8" />
    <div class="d-flex">
      <v-btn
        @click="$emit('previous')"
        role="link"
        class="link-button no-border"
      >
        <v-icon size="20">chevron_left</v-icon>
        <span>Back</span></v-btn
      >
      <v-btn @click="$emit('next')" depressed color="primary" role="link" class="ml-auto"
        >Continue</v-btn
      >
    </div>
  </nav>
</template>

<script>
export default {
  name: "ATATStepperNavigation",
};
</script>
