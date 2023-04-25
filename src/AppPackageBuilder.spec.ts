import Vue from "vue";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import AppPackageBuilder from "@/AppPackageBuilder.vue";
import SlideoutPanel from "@/store/slideoutPanel/index";

Vue.use(Vuetify);

describe("Testing FundingTracker Component", () => {
  const localVue = createLocalVue();
  localVue.use(VueRouter);

  const routes = [
    {
      name: "Project_Overview",
      path: "/"
    }
  ];

  const router = new VueRouter({
    routes
  });

  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(AppPackageBuilder, {
      localVue,
      vuetify,
      router,
    });
  })

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("method panelContent() - tests undefined", async () => {
    const panelContent = wrapper.vm.panelContent;
    expect(panelContent).not.toBe(undefined);
  });
 
  it("navigate() - tests back to home", async () => {
    wrapper.vm.$data.altBackDestination = "Home";
    await wrapper.vm.navigate("previous");
    expect(router.app.$route.name).toBe("routeResolver");
  });


})
