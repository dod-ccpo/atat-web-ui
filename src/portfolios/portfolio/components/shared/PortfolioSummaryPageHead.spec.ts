import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import PortfolioSummaryPageHead from
  "@/portfolios/portfolio/components/shared/PortfolioSummaryPageHead.vue";
import SlideoutPanel from "@/store/slideoutPanel";
import PortfolioData from "@/store/portfolio";
Vue.use(Vuetify);

describe("Testing Members Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(PortfolioSummaryPageHead, {
      localVue,
      vuetify,
      propsData: {
        title: "portfoliotest",
        portfolioStatus:"Active"
      }
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("test openModal() - check expected results", 
    async () => {
      await wrapper.vm.openModal();
      expect(PortfolioData.showAddMembersModal).toBe(true);
    })

  it("test openModal() - check expected results", 
    async () => {
      const booleanVar = true;
      jest.spyOn(PortfolioData,'setShowAddMembersModal').mockImplementation(
        ()=>{
          return{
            showAddMembersModal: booleanVar
          }
        }
      )
      await wrapper.vm.openModal();
      expect(PortfolioData.showAddMembersModal).toBe(booleanVar);
    })


  // it("test saveTitle() - check expected results ", 
  //   async () => {
  //     const dummyTitle = "dummyTitle";
  //     jest.spyOn(PortfolioData,'getPortfolioData').mockImplementation(
  //       ()=>Promise.resolve(
  //         {
  //           title: dummyTitle
  //         }
  //       ));
      
  //     await wrapper.setProps({
  //       title: dummyTitle
  //     })
  //     await wrapper.vm.saveTitle();
  //     expect(PortfolioData.currentPortfolio.title).toBe(dummyTitle);
  //   })



  it("test openSlideoutPanel()- should toggle the value of showDrawer to true",async ()=> {
    jest.spyOn(SlideoutPanel,'openSlideoutPanel').mockImplementation()
    const eObject = {
      currentTarget: 'test', 
      preventDefault: jest.fn(),
      cancelBubble: false,
    }
    const memberModal = wrapper.vm.showDrawer
    expect(memberModal).toBe(false)
    wrapper.vm.openSlideoutPanel(eObject)
    wrapper.vm.$nextTick(()=> expect(memberModal).toBe(true))
  })

  it("test openSlideoutPanel()- should toggle the value of showDrawer to false",async ()=> {
    jest.spyOn(SlideoutPanel,'openSlideoutPanel').mockImplementation()
    wrapper.setData({showDrawer:true})
    const memberModal = wrapper.vm.showDrawer
    expect(memberModal).toBe(true)
    wrapper.vm.openSlideoutPanel()
    wrapper.vm.$nextTick(()=> expect(memberModal).toBe(false))
  })

  it("test openSlideoutPanel()- should toggle the value of showDrawer to false",async ()=> {
    jest.spyOn(SlideoutPanel,'openSlideoutPanel').mockImplementation()
    wrapper.setData({showDrawer:true})
    const memberModal = wrapper.vm.showDrawer
    expect(memberModal).toBe(true)
    wrapper.vm.openSlideoutPanel()
    wrapper.vm.$nextTick(()=> expect(memberModal).toBe(false))
  })

  it("movetoinput", async()=> {
    // stub in necessary header text field textbox 
    const id = "HeaderTextField";
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", id);
    document.body.appendChild(input);

    await wrapper.vm.moveToInput();
    expect(document.activeElement?.id).toBe(id);


  })
})
