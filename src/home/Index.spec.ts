import Vue from "vue";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import Home from "./Index.vue";
import { 
  AcquisitionPackageSummaryDTO, 
  AcquisitionPackageSummaryMetadataAndDataDTO 
} from "@/api/models";
import AcquisitionPackageSummary from "@/store/acquisitionPackageSummary";
import validators from "@/plugins/validation";

Vue.use(Vuetify);


describe("Testing Landing Page", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  localVue.use(VueRouter);

  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  
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
      } as unknown as Promise<AcquisitionPackageSummaryMetadataAndDataDTO>
      )
    vuetify = new Vuetify();
    wrapper = mount(Home, {
      vuetify,
      localVue,
      router,
    });

    const el = document.createElement("div");
    el.setAttribute("id", "HelpfulResourcesCards");
    el.scrollIntoView = jest.fn();
    document.body.appendChild(el);

  });

  describe("testing Landing Page (Home)", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("startNewAcquisition()", async () => {
      await wrapper.vm.startNewAcquisition();
      expect(wrapper.vm.$route.name).toBe("DAPPSChecklist");
    });

  });

});
