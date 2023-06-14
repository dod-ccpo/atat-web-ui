import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import ExistingUser from "./ExistingUser.vue";
import validators from "@/plugins/validation";

import VueRouter from "vue-router";
import { 
  AcquisitionPackageSummaryDTO,
  AcquisitionPackageSummaryMetadataAndDataDTO
} from "@/api/models";
import AcquisitionPackageSummary from "@/store/acquisitionPackageSummary";
import CurrentUserStore from "@/store/user"

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
  localVue.use(validators);

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


  beforeEach(() => {

    jest.spyOn(AcquisitionPackageSummary,'searchAcquisitionPackageSummaryList')
      .mockReturnValue(
    {
      acquisitionPackageSummaryList: acqPackageSummaryList,
      // eslint-disable-next-line camelcase
      total_count: 1
    } as unknown as Promise<AcquisitionPackageSummaryMetadataAndDataDTO>)

    vuetify = new Vuetify();
    wrapper = mount(ExistingUser, {
      vuetify,
      localVue,
      router,
    });
  });
  
  describe("testing Existing User", () => {
    it("renders successfully", async () => {
      expect(await wrapper.exists()).toBe(true);
    });


    it("loadOnEnter() to return rejected value and execute catch block", async()=>{
      jest.spyOn(console, 'log');
      jest.spyOn(AcquisitionPackageSummary,'searchAcquisitionPackageSummaryList')
        .mockRejectedValueOnce(
        {
          acquisitionPackageSummaryList: ['string'],
          // eslint-disable-next-line camelcase
          total_count: 1
        } as unknown as Promise<AcquisitionPackageSummaryMetadataAndDataDTO>
        )
      await wrapper.vm.loadOnEnter();
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining(
        "Error loading acquisition package data"
      ));
    })

    it("loadOnEnter() to return accurate $data.packageCount", async()=>{
      CurrentUserStore.doSetPackageCount(1);
      Vue.nextTick(() => {
        expect(wrapper.vm.$data.packageCount).toBe(1);
      })
    })

    it("testing @keydown.space to trigger viewAllPackages() ", async () => {

      const anchorLink = wrapper.find("#viewAllPackagesLink");
      anchorLink.trigger('keydown.space'); // trigger viewAllPackages();
      expect(wrapper.vm.$route.name).toBe("Project_Overview");
    });

    it("testing @keydown.enter to trigger viewAllPackages() ", async () => {
      const anchorLink = wrapper.find("#viewAllPackagesLink");
      anchorLink.trigger('keydown.enter'); // trigger viewAllPackages();
      expect(wrapper.vm.$route.name).toBe("Project_Overview");
    });
  });
});
