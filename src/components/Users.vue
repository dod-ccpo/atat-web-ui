<template>
  <div class="d-flex flex-column " style="scroll-y: auto">
    <div class="mx-auto" v-if="users.length == 0">LOADING...</div>
     <!-- <v-card v-else
     v-for="user in users" :key="user.sysId" class="pa-2 mb-6" outlined tile>
      <v-list-item three-line>
        <v-list-item-content>
          <div class="text-overline font-weight-bold mb-4 text-h2">
            <strong>{{ user.first_name }} {{ user.last_name }}</strong>
          </div>
          <v-list-item-title class="text-h5 mb-1">
            {{ user.email }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card> -->

    <v-card v-else
    class=""
  >
  <v-card-title style="border-bottom: 1px solid black">Users</v-card-title>
    <v-list three-line  style="max-height: 250px; overflow:hidden"
       class="overflow-y-auto">
      <template v-for="user in users">
        <v-list-item
          :key="user.sysId"
        >
          <v-list-item-content>
            <v-list-item-title>{{user.first_name}} {{user.last_name}}</v-list-item-title>
            <v-list-item-subtitle>{{user.email}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider :key="`divider_${user.sysId}`"></v-divider>
      </template>
    </v-list>
  </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { UserData } from "../models/User";
import api from "../api";

@Component({})
export default class Users extends Vue {
  users: UserData[] = [];

  async mounted(): Promise<void> {
    this.users = await api.users.getAllUsers();
  }
}
</script>
