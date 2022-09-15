import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import DocumentReview from "@/documentReview/Index.vue";
import VueRouter, { RouteConfig } from 'vue-router'

describe("Testing index Component", () => {
  const localVue = createLocalVue();
  localVue.use(VueRouter)
  localVue.use(Vuetify);
  let vuetify: Vuetify;
  let router: VueRouter;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  const routes: RouteConfig[] = [
    {
      path: '/docReviewPreview',
      name: 'preview',
    },
    {
      path: '/docReviewForm',
      name: 'form',
    }
  ];

  beforeEach(() => {
    vuetify = new Vuetify();
    router = new VueRouter({routes});
    wrapper = mount(DocumentReview, {
      localVue,
      vuetify,
      router
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("get isForm() - set route so that isForm===true", async () => {
    expect(wrapper.vm.isForm).toBe(true);
  });

  it("get isForm() - set route so that isForm===false", async () => {
    wrapper.vm.$router.replace("/docReviewPreview");
    expect(wrapper.vm.isForm).toBe(false);
  });

  it("get panelContent() - ensure panelContent returns component", async () => {
    const loadedComponent = await wrapper.vm.panelContent as Vue.Component;
    expect(loadedComponent.name).toBe("CommentsPanel");
  });

});