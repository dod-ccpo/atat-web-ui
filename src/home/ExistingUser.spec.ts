import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import ExistingUser from "./ExistingUser.vue";
import VueRouter from "vue-router";
import { 
  AcquisitionPackageSummaryDTO,
  AcquisitionPackageSummarySearchDTO, 
  AcquisitionPackageSummaryMetadataAndDataDTO
} from "@/api/models";
import AcquisitionPackageSummary from "@/store/acquisitionPackageSummary";

const acqPackageSummaryList: AcquisitionPackageSummaryDTO[] = [
  {
    "sys_id": "90",
    "project_overview": {
      "display_value": "",
      "value": ""
    },
    "secondary_reviewers": {
      "display_value": "",
      "value": ""
    },
    "package_status": {
      "display_value": "Draft",
      "value": "DRAFT"
    },
    "mission_owners": {
      "display_value": "Maria Missionowner ",
      "value": "id_01"
    },
    "contract_award": {
      "display_value": "",
      "value": ""
    },
    "contributors": {
      "display_value": "",
      "value": ""
    },
  },
  {
    "sys_id": "91",
    "project_overview": {
      "display_value": "",
      "value": ""
    },
    "secondary_reviewers": {
      "display_value": "",
      "value": ""
    },
    "package_status": {
      "display_value": "Waiting for Task Order",
      "value": "WAITING_FOR_TASK_ORDER"
    },
    "mission_owners": {
      "display_value": "Maria Missionowner ",
      "value": "id_01"
    },
    "contract_award": {
      "display_value": "",
      "value": ""
    },
    "contributors": {
      "display_value": "",
      "value": ""
    }
  },
];

Vue.use(Vuetify);

describe("Existing User Component", () => {
  const localVue = createLocalVue();
  localVue.use(VueRouter);

  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  const routes = [
    {
      name: "Project_Overview",
      path: "/"
    }
  ];

  const router = new VueRouter({
    routes
  });

  jest.spyOn(AcquisitionPackageSummary,'searchAcquisitionPackageSummaryList')
    .mockReturnValue(
    {
      acquisitionPackageSummaryList: acqPackageSummaryList,
      // eslint-disable-next-line camelcase
      total_count: 1
    } as unknown as Promise<AcquisitionPackageSummaryMetadataAndDataDTO>)

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ExistingUser, {
      vuetify,
      localVue,
      router,
    });
  });
  
  afterEach(()=>{
    // console.log("showAlert");
    // console.log(wrapper.vm.showAlert)
    // console.log("draftPackageCount")
    // console.log(wrapper.vm.$data.draftPackageCount)
    // console.log("packageCount")
    // console.log(wrapper.vm.$data.packageCount)
    console.log("portfolioCount")
    console.log(wrapper.vm.$data.portfolioCount)
  })
 


  describe("testing Existing User", () => {
    it("renders successfully", async () => {
      expect(await wrapper.exists()).toBe(true);
    });

    it("showAlert() - set $data.draftPackageCount>0 to return true", async ()=>{
      await wrapper.setData({
        draftPackageCount: 4
      })
      expect(await wrapper.vm.showAlert).toBe(true);
      
    })


    it("showAlert() - set $data.draftPackageCount===0 to return false", async ()=>{
      await wrapper.setData({
        draftPackageCount: 0
      })
      expect(await wrapper.vm.showAlert).toBe(false);
    })

    it("updateTotalPortfolios()", async () => {
      wrapper.vm.$data.portfolioCount = 0;
      await wrapper.vm.updateTotalPortfolios(5);
      expect(await wrapper.vm.$data.portfolioCount).toBe(5);
    });

    it("loadOnEnter()", async()=>{
      jest.spyOn(AcquisitionPackageSummary,'searchAcquisitionPackageSummaryList')
        .mockReturnValue(
        {
          acquisitionPackageSummaryList: [acqPackageSummaryList[0]],
          // eslint-disable-next-line camelcase
          total_count: 1
        } as unknown as Promise<AcquisitionPackageSummaryMetadataAndDataDTO>)
    })

    it("viewAllPortfolios()", async () => {
      await wrapper.vm.viewAllPortfolios();
    });

    it("startNewAcquisition()", async () => {
      await wrapper.vm.startNewAcquisition();
      expect(wrapper.emitted("startNewAcquisition")).toBeTruthy();
      expect(router.app.$route.name).toBe("Project_Overview");
    });

    it("viewAllPackages()", async () => {
      await wrapper.vm.viewAllPackages();
      expect(router.app.$route.name).toBe("Project_Overview");
    });

  });

});

describe("Existing User Component", () => {
  const localVue = createLocalVue();
  localVue.use(VueRouter);

  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  const routes = [
    {
      name: "Project_Overview",
      path: "/"
    }
  ];

  const router = new VueRouter({
    routes
  });

  jest.spyOn(AcquisitionPackageSummary,'searchAcquisitionPackageSummaryList')
    .mockReturnValue(
    {
      acquisitionPackageSummaryList: acqPackageSummaryList,
      // eslint-disable-next-line camelcase
      total_count: 3
    } as unknown as Promise<AcquisitionPackageSummaryMetadataAndDataDTO>)

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ExistingUser, {
      vuetify,
      localVue,
      router,
      data:{
        portfolioCount: 1,
        packageCount: 3,
        packagesPanel: 1,
        portfolioPanel: 1
      }
    });
  });

  afterEach(()=>{
    // console.log("showAlert");
    // console.log(wrapper.vm.showAlert)
    // console.log("draftPackageCount")
    // console.log(wrapper.vm.$data.draftPackageCount)
    // console.log("packageCount")
    // console.log(wrapper.vm.$data.packageCount)
    console.log("portfolioCount")
    console.log(wrapper.vm.$data.portfolioCount)
  })


  describe("testing Existing User", () => {
    it("renders successfully", async () => {
      await wrapper.vm.updateTotalPortfolios(1);
      expect(await wrapper.exists()).toBe(true);
    });
  });
});
