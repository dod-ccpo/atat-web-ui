<template>
    <div>Step One</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({
    name:"StepOne"
})
export default class StepOne extends Vue {
    private step = null;

}
</script>