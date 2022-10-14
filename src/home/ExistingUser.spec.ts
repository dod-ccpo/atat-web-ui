import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import ExistingUser from "./ExistingUser.vue";
import VueRouter from "vue-router";
import { PackageSummaryDTO } from "@/api/models";
import PackageSummary from "@/store/packageSummary";
import { resolve } from "path";

Vue.use(Vuetify);

describe("Existing User Component", () => {
  const localVue = createLocalVue();
  localVue.use(VueRouter);

  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  const packages: PackageSummaryDTO[] = [
    {
      // eslint-disable-next-line camelcase
      sys_id: "123456"
    }
  ]

  const routes = [
    {
      name: "Project_Overview",
      path: "/"
    }
  ];

  const router = new VueRouter({
    routes
  });

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ExistingUser, {
      vuetify,
      localVue,
      router,
    });
  });

  describe("testing Existing User", () => {
    it("renders successfully", async () => {
      jest.spyOn(PackageSummary, "getPackageData").mockImplementation(
        async(): Promise<PackageSummaryDTO[]> => packages
      )
      expect(wrapper.exists()).toBe(true);
    });

    it("updateTotalPortfolios()", async () => {
      wrapper.vm.$data.portfolioCount = 0;
      await wrapper.vm.updateTotalPortfolios(5);
      expect(wrapper.vm.$data.portfolioCount).toBe(5);
    });

    it("viewAllPortfolios()", async () => {
      wrapper.vm.viewAllPortfolios();
    });

    it("startNewAcquisition()", async () => {
      wrapper.vm.startNewAcquisition();
      expect(router.app.$route.name).toBe("Project_Overview");
    });

    it("viewAllPackages()", async () => {
      wrapper.vm.viewAllPackages();
      expect(router.app.$route.name).toBe("Project_Overview");
    });

  });

});
