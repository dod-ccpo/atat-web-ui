import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import Exceptions from "@/steps/02-EvaluationCriteria/Exceptions.vue";
import validators from "../../plugins/validation";
import AcquisitionPackage,{ StoreProperties}
  from "@/store/acquisitionPackage";

import { FairOpportunityDTO } from "@/api/models"

Vue.use(Vuetify);

describe("Testing CreateEvalPlan Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(validators);

  const mockProjectOverviewDTO = {
    "scope": "Scope From Store",
    "title": "Title From Store",
    "emergency_declaration": "yes"
  }; 

  const mockProjectOverviewDTOCurrent = {
    "scope": "current scope",
    "title": "current title",
    "emergency_declaration": "yes"
  }; 


  beforeEach(() => {
    jest.spyOn(AcquisitionPackage, 'loadData').mockImplementation(
      // eslint-disable-next-line camelcase
      ()=>Promise.resolve({ exception_to_fair_opportunity: "NO_NONE"}));

    jest.spyOn(AcquisitionPackage, 'saveData').mockImplementation(
      ()=>Promise.resolve());


    vuetify = new Vuetify();
    wrapper = mount(Exceptions, {
      vuetify,
      localVue
    });
  });

  describe("testing Exceptions", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("saveOnLeave() - if data has changed", async () => {
      await wrapper.setData({
        /* eslint-disable camelcase */
        currentData: { exception_to_fair_opportunity: "NO" },
        savedData: { exception_to_fair_opportunity: "YES" }
        /* eslint-enable camelcase */
      });
      Vue.nextTick(async () => {
        const saveOnLeave = await wrapper.vm.saveOnLeave();
        expect(saveOnLeave).toBe(true)
        Vue.nextTick(async () => {
          const storeData: FairOpportunityDTO = await AcquisitionPackage.loadData(
            { storeProperty: StoreProperties.FairOpportunity }
          );
          expect(storeData.exception_to_fair_opportunity).toBe("NO_NONE");
        })
  
      })

    })

  })
})
