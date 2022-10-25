import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import validators from "../../../plugins/validation"
import FeeCharged from "@/steps/10-FinancialDetails/IGCE/FeeCharged.vue";
import IGCEStore from "@/store/IGCE";
Vue.use(Vuetify);

describe("Testing FeeCharged Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(validators)

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(FeeCharged, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("hasChanged() retrieves expected boolean value", async () => {
    const isCharged = "YES";
    wrapper.setData({
      isCharged,
      savedData:{
        isCharged: "NO"
      }
    })
    const hasChanged: boolean = wrapper.vm.hasChanged();
    expect(hasChanged).toBe(true);
  });

  it("hasErrorMessages() returns errorMessages array ", async () => {
    await wrapper.setData({
      isCharged: "YES"
    })

    const textBox = await wrapper.find({ref: "PercentageTextbox"});
    textBox.vm.$data.errorMessages =["Required"]
    
    const hasErrorMessages = await wrapper.vm.hasErrorMessages();
    expect(hasErrorMessages).toBe(true);
  });

  it("hasErrorMessages() doesnt returns errorMessages array ", async () => {
    await wrapper.setData({
      isCharged: "NO"
    })
    
    const hasErrorMessages = await wrapper.vm.hasErrorMessages();
    expect(hasErrorMessages).toBe(false);
  });


  it("saveOnLeave() if data has changed, and NO errorMessages set new data to " +
  "IGCEStore.setFeeSpecs", async () => {
    const isCharged = "YES";
    const percentage= "15";
    wrapper.setData({
      isCharged,
      percentage,
      savedData:{
        isCharged: 'NO',
        percentage: ''
      }
    })
    await wrapper.vm.saveOnLeave();
    const reqCostEst = await IGCEStore.getFeeSpecs()
    expect(reqCostEst.isCharged).toBe(isCharged);
  });

  it("saveOnLeave() if data has changed, and there are errorMessages, then save new data to " +
  "IGCEStore.setFeeSpecs and don't save percentage", async () => {
    const isCharged = "YES";
    const percentage= "15";
    wrapper.setData({
      isCharged,
      percentage,
      savedData:{
        isCharged: 'NO',
        percentage: ''
      }
    })

    //add error message
    const textBox = await wrapper.find({ref: "PercentageTextbox"});
    textBox.vm.$data.errorMessages =["Required"]

    await wrapper.vm.saveOnLeave();
    const reqCostEst = await IGCEStore.getFeeSpecs()
    expect(reqCostEst.percentage).not.toBe(percentage);
  });



})
