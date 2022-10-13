/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import PropertyDetails from "@/steps/06-GovtFurnishedEquipment/PropertyDetails.vue";
import validators from "../../plugins/validation";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { GFEOverviewDTO } from "@/api/models";
Vue.use(Vuetify);

describe("Testing PropertyDetails Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(validators);

  const mockGFEOverviewDTO: GFEOverviewDTO = {
    dpas_unit_identification_code: "",
    gfe_gfp_furnished: "",
    dpas_custodian_number: "",
    property_accountable: "",
    property_custodian_name: "",
  };

  beforeEach(() => {
    jest.spyOn(AcquisitionPackage, 'loadData').mockImplementation(
      () => Promise.resolve(mockGFEOverviewDTO)
    );

    jest.spyOn(AcquisitionPackage, 'saveData').mockImplementation(
      () => Promise.resolve()
    );

    vuetify = new Vuetify();
    wrapper = mount(PropertyDetails, {
      localVue,
      vuetify,
    });

  });

  afterEach(()=>{
    jest.clearAllMocks();
  })

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
  it("hasChanged() - change data", async () =>  {
    await wrapper.setData({
      currentData: {
        gfe_gfp_furnished: "Yes"
      },
    })
    const hasChanged = await wrapper.vm.hasChanged()
    expect(hasChanged).toBeTruthy()
  })
  it("saveOnLeave() - save contact data", async () => {
    await wrapper.setData({
      savedData: {
        gfe_gfp_furnished: "Yes"
      },
    })
    const saveOnLeave = await wrapper.vm.saveOnLeave()
    expect(saveOnLeave).toBeTruthy()
  })
  it("isDISA() - check if agency is DISA", async () => {
    AcquisitionPackage.doSetSelectedAgency({
      text: "Defense information Systems Agency (DISA)",
      value: "DEFENSE INFORMATION SYSTEMS AGENCY (DISA)"
    })
    const isDisa = await wrapper.vm.isDISA
    expect(isDisa).toBeTruthy()
  })
})