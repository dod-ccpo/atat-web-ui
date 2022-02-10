<template>
  <v-autocomplete
    class="search-icon"
    v-model="model"
    :items="items"
    :loading="isLoading"
    :search-input.sync="search"
    hide-selected
    item-value="API"
    placeholder="Search by name or email"
    return-object
    append-icon="search"
    clearable
    item-text="Description"
    outlined
    attach
  >
    <template v-slot:item="{item}">
      <v-list-item-content>
        <v-list-item-title v-text="item.Description"></v-list-item-title>
        <v-list-item-subtitle v-text="item.Link"></v-list-item-subtitle>
      </v-list-item-content>
    </template>
    <template v-slot:no-data>
        <v-list-item>
          <v-list-item-title>
            No results found. 
            <a href="#">
              Manually enter my contact’s information
            </a>
          </v-list-item-title>
        </v-list-item>
      </template>
  </v-autocomplete>

</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";

@Component({})

export default class ATATAutoComplete extends Vue {
  @Prop({ default: false }) private hasSubtitle!: boolean;

  // data: () => ({
  //   descriptionLimit: 60,
  //   entries: [],
  //   isLoading: false,
  //   model: null,
  //   search: null,
  // }),

  // computed: {
  //   // fields () { // EJY what does this do?
  //   //   if (!this.model) return []

  //   //   return Object.keys(this.model).map(key => {
  //   //     return {
  //   //       key,
  //   //       value: this.model[key] || 'n/a',
  //   //     }
  //   //   })
  //   // },
  //   items () {
  //     return this.entries.map(entry => {
  //       let Description = entry.Description.length > this.descriptionLimit
  //         ? entry.Description.slice(0, this.descriptionLimit) + '...'
  //         : entry.Description
  //       return Object.assign({}, entry, { Description })
  //     })
  //   },
  // },

  // watch: {
  //   search () { // search (val) {
  //     // Items have already been loaded
  //     if (this.items.length > 0) return

  //     // Items have already been requested
  //     if (this.isLoading) return

  //     this.isLoading = true

  //     // Lazily load input items
  //     fetch('https://api.publicapis.org/entries')
  //       .then(res => res.json())
  //       .then(res => {
  //         const { count, entries } = res
  //         this.count = count
  //         this.entries = entries
  //       })
  //       .catch(err => {
  //         console.log(err)
  //       })
  //       .finally(() => (this.isLoading = false))
  //   },
  // },

}
</script>

<style lang="scss" scoped>
.v-list-item__title, .v-list-item__subtitle {
  font-size: 1.6rem;
  text-align: left;
}
 .v-list-item__subtitle {
   font-size: 1.4rem;
 }
</style>