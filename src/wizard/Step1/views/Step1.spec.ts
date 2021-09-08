import Vue from 'vue';
import Vuetify from 'vuetify'
import Vuex from 'vuex';
import { createLocalVue, mount } from '@vue/test-utils';
import stepOne from "@/wizard/Step1/views/Step1.vue";
import axios from 'axios';
import VueAxios from 'vue-axios'

Vue.use(Vuetify);
// Vue.use(VueAxios, axios);

// let url = ''
// let body = {}

// jest.mock('axios', () => ({
//     post: jest.fn(() => {
//         return {
//             data:{
//                 "id": "dc2bbee6-8cdb-477e-a363-f9f1593a0a9b",
//                 "status": "not_started",
//                 "created_at": "2021-08-03T16:19:51.686Z",
//                 "updated_at": "2021-08-03T16:19:51.686Z"
//             }
//         }
//     })
//   }))

// jest.mock("axios", async () => ({
//   post: (_url: string, _body: any) => { 
//     Promise.resolve({
//         data:{
//             "id": "dc2bbee6-8cdb-477e-a363-f9f1593a0a9b",
//             "status": "not_started",
//             "created_at": "2021-08-03T16:19:51.686Z",
//             "updated_at": "2021-08-03T16:19:51.686Z"
//         }
//     })
//   }
// }))

// jest.mock("axios", () => ({
//   post: (_url: string, _body: any) => { 
//     return new Promise((resolve) => {
//       url = _url
//       body = _body
//       resolve(true);
//     //   data:{
//     //     "id": "dc2bbee6-8cdb-477e-a363-f9f1593a0a9b",
//     //     "status": "not_started",
//     //     "created_at": "2021-08-03T16:19:51.686Z",
//     //     "updated_at": "2021-08-03T16:19:51.686Z"
//     // }
//     })
//   }
// }))

// jest.mock("axios", ()=>({
//     post: ('',{}) =>{
//         return new Promise((resolve)=>{
//             resolve(data:{
//                 "id": "dc2bbee6-8cdb-477e-a363-f9f1593a0a9b",
//                 "status": "not_started",
//                 "created_at": "2021-08-03T16:19:51.686Z",
//                 "updated_at": "2021-08-03T16:19:51.686Z"
//             })
//         })
//     }}));
// this.$http.post("portfolioDrafts?offset=0&limit=20").then((response
// removes vuetify warnings
// document.body.setAttribute('data-app', "true")
describe('Testing Step1 Component', () => {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    localVue.use(VueAxios, axios);
    let vuetify: any;
    let wrapper: any;
    let store: any;
    let actions: any = {
        updateWizardStep: jest.fn()
    }

    beforeEach(() => {
        vuetify = new Vuetify();
        store = new Vuex.Store({
           actions
        });
        wrapper = mount(stepOne, {
            store,
            localVue, 
            vuetify,
            stubs: ['CreatePortfolioForm','atat-text-field', 'atat-text-area', 'atat-button-card']
        })
    });

    it('renders successfully', async () => {
        expect(wrapper.exists()).toBe(true);
    })

    it('contains CreatePortfolioForm Component', () => {
        expect(wrapper.vm.$refs.createPortfolioForm).toBeDefined();
    });

    it('contains CloudServiceProviderForm Component', () => {
        expect(wrapper.vm.$refs.cloudServiceProviderForm).toBeDefined();
    });
//  it('should ', () => {
     
//  });


})

