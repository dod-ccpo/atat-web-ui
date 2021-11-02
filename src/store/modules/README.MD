# Store Modules


## Reference

[Typescript Vuex Modules examples](https://codeburst.io/vuex-and-typescript-3427ba78cfa8)

## Folder Structure
```
modules/
├─ moduleOne/
│  ├─ types/
│  │  ├─ index.ts
│  ├─ mutations.ts
│  ├─ actions.ts
│  ├─ store.ts
│  ├─ getters.ts
/

```


## Module structure

```
import { Module } from 'vuex';  
import { getters } from './getters';  
import { actions } from './actions';  
import { muations } from './mutations';  
import { ModuleState } from './types';  
import { RootState } from '../types';  

// module state with props
export const state: ModuleOneState = {  
	users: [],  
	error: boolean
}
 
const namespaced: boolean = true;  
  
export const moduleOne: Module<ModuleState, RootState> = {  
	namespaced,  
	state,  
	getters,  
	actions,  
	mutations  
};
```

### Actions
```
import { ActionTree, Commit } from  "vuex";

import { RootState } from  "@/store/types";

import  ModuleOneState  from  "./types";

import userApi from "@/api";

//define actions
const  loadUsers = async ({commit}: { commit: Commit;}): Promise<void> => {
	const  users = await  userApi.getAll();
	commit("updateUsers", users);
};

const deleteUser = async ({commit} : {commit: Commit;}, userId: string): Promise<void> => {
    commit("deleteUser", userId);
}

// export module action tree
export  const  actions: ActionTree<ModuleOneState, RootState> = {
	loadUsers,
	deleteUser,
};
```

### Mutations
```
import  Vue  from  "vue";
import { MutationTree } from  "vuex";
import  ModuleOneState  from  "./types";
import { User } from  "types/Users";
 
// define mutations
const  updateUsers = (state: ModuleOneState, users: Users[]
): void  => {
	Vue.set(state, "users", [...users]);
};

const deleteUser = (state: ModuleOneState, userId: string) => {
	const userIndex = state.users.findIndex((user) => user.id === userId);
	 if (userIndex > -1) {
		state.users.splice(userIndex, 1);
	}
};

export  const  mutations: MutationTree<ModuleOneState> = {
	updateUsers,
	deleteUser,
}
```

### Getters
```
import { GetterTree } from 'vuex';  
import { ProfileState } from './types';  
import { RootState } from '../types';  
import {User} from  '../types/User';
  
export const getters: GetterTree<ModuleOneState, RootState> = {    
    users(state): User[] => state.users;
};
```

### Users component
```

<template>  
    <div class="container">  
        <div v-if="moduleOne.users">  
            <p>  
                First User: {{ firstUser.name  }}  
            </p>  
        </div>  
        <div v-if="moduleOne.error">  
            Oops an error occured  
        </div>  
    </div>  
</template>  
  
<script lang="ts">  
    import Vue from 'vue';  
    import { State, Action, Getter } from 'vuex-class';  
    import Component from 'vue-class-component';  
    import { ModuleOneState, User } from './store/profile/types';  
    const namespace: string = 'moduleOne';
   
    @Component  
    export default class UserDetail extends Vue {  
        @State('moduleOne') moduleOne: ModuleOneState;  
        @Action('loadUsers', { namespace }) loadUsers!: Promise<void>;  
        @Getter('users', { namespace }) users: User[];  
        async mounted() {  
            // fetching data as soon as the component's been mounted  
            await this.loadUsers();
        }  
        // computed variable based on user data 
        get firstUser() {  
            const users =  this.moduleOne && this.moduleOne.users;  
            const user = users && users.length > 0  ? users[0] : "";
            return user; 
        }  
    }  
</script>
```