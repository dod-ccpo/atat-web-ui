
import { shallowMount, createLocalVue } from '@vue/test-utils';
import App from '@/App.vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import vuetify from '@/plugins/vuetify';
import validation from '@/plugins/validation';
import sanitize from '@/plugins/sanitize';

// Create a localVue instance to use for mounting components with plugins
const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);
localVue.use(validation);
localVue.use(sanitize);

describe('App', () => {
  it('renders without errors', () => {
    const router = new VueRouter();
    const store = new Vuex.Store({});
    const wrapper = shallowMount(App, {
      localVue,
      vuetify,
      router,
      store,
    });

    expect(wrapper.exists()).toBe(true);
  });
});