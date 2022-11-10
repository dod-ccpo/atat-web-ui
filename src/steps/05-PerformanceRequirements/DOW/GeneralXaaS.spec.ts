import Vue, { computed, VueConstructor } from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper, config } from "@vue/test-utils";
import validators from "../../../plugins/validation";
import { DefaultProps } from "vue/types/options";
import { init, validateInput } from "@/helpers/unitTests";

import GeneralXaaSForm from "./GeneralXaaSForm.vue";
Vue.use(Vuetify);


const generalXaaSData = {
  "instanceNumber": 1,
  "environmentType": "Dev/Testing",
  // `pragma: allowlist secret`
  "classificationLevel": "",
  "deployedRegions": [
    "CONUS East"
  ],
  "deployedRegionsOther": "",
  "descriptionOfNeed": "sfsfsdfsad",
  "entireDuration": "",
  "periodsNeeded": [
    "1",
    "2"
  ],
  "operatingSystemAndLicensing": "safsfsdaf",
  "numberOfVCPUs": "1",
  "memory": "1",
  "storageType": "Provisioned IOPS SSD",
  "storageAmount": "1",
  "performanceTier": "Premium",
  "performanceTierOther": "",
  "numberOfInstancesNeeded": "1",
  "requirementTitle": "asdfdsfadfa"
}

const avlClassificationLevelObjects = [
  { classification: "U", "impact_level": "IL2" }
]

describe("Testing GeneralXaaSForm Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  localVue.use(Vuex);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  config.showDeprecationWarnings = false
  Vue.config.silent = true;

  beforeEach(async () => {
    vuetify = new Vuetify();
    wrapper = mount(GeneralXaaSForm, {
      localVue,
      vuetify,
      propsData: {
        generalXaaSData: generalXaaSData,
        avlClassificationLevelObjects: avlClassificationLevelObjects,
      }
    });

    // needed for helper functions
    await init(wrapper, localVue);
  });

  describe("Initialization...", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Methods...", () => {
    it(`tests that 'openModal' is emitted when user clicks to update 
      classification requirements`, async () => {
      await wrapper.vm.openModal();
      expect(wrapper.emitted().openModal).toBeTruthy();
    });
  });

  /*describe("Validation....", () => {

    it("tests that Requirement Title text field required validation is triggered", async () => {
      const props = { generalXaaSData: { requirementTitle: "" }};
      const success = await validateInput("required", props, "RequirementTitle", 0);
      expect(success).toBeTruthy();

    });
   
  });*/

});
