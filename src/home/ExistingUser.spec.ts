import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import ExistingUser from "./ExistingUser.vue";
import VueRouter from "vue-router";
import { 
  AcquisitionPackageSummaryDTO,
  AcquisitionPackageSummarySearchDTO, 
} from "@/api/models";
import AcquisitionPackageSummary from "@/store/acquisitionPackageSummary";
import { isJSDocUnknownTag } from "typescript";

Vue.use(Vuetify);

describe("Existing User Component", () => {
  const localVue = createLocalVue();
  localVue.use(VueRouter);

  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  const packages: AcquisitionPackageSummaryDTO[] = [
    {
      // eslint-disable-next-line camelcase
      sys_id: "123456",
    }
  ];
  const totalCount = 1;
  const packageData = {
    acquisitionPackageSummaryList: packages,
    // eslint-disable-next-line camelcase
    total_count: totalCount
  }
    
  const routes = [
    {
      name: "Project_Overview",
      path: "/"
    }
  ];

  const router = new VueRouter({
    routes
  });

  const searchDTO:AcquisitionPackageSummarySearchDTO = {
    acquisitionPackageStatus: "DRAFT,WAITING_FOR_SIGNATURES,WAITING_FOR_TASK_ORDER",
    searchString: "",
    sort: "DESCsys_updated_on",
    limit: 5,
    offset: 0
  };


  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ExistingUser, {
      vuetify,
      localVue,
      router,
      data: {
        searchDTO
      }
    });
  });

  describe("testing Existing User", () => {
    it("renders successfully", async () => {
      jest.spyOn(AcquisitionPackageSummary, "getAcquisitionPackageSummaryCount")
        .mockImplementation(() => totalCount);
      jest.spyOn(AcquisitionPackageSummary, "searchAcquisitionPackageSummaryList")
        .mockImplementation(async () => Promise.resolve(packageData));
      // jest.spyOn(AcquisitionPackageSummary,'searchAcquisitionPackageSummaryList')
      //   .mockImplementation()
      
      expect(wrapper.exists()).toBe(true);
    });

    // it("updateTotalPortfolios()", async () => {
    //   wrapper.vm.$data.portfolioCount = 0;
    //   await wrapper.vm.updateTotalPortfolios(5);
    //   expect(wrapper.vm.$data.portfolioCount).toBe(5);
    // });

    // it("viewAllPortfolios()", async () => {
    //   wrapper.vm.viewAllPortfolios();
    // });

    // it("startNewAcquisition()", async () => {
    //   wrapper.vm.startNewAcquisition();
    //   expect(router.app.$route.name).toBe("Project_Overview");
    // });

    // it("viewAllPackages()", async () => {
    //   wrapper.vm.viewAllPackages();
    //   expect(router.app.$route.name).toBe("Project_Overview");
    // });

  });

});
