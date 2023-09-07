/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import AddToExistingPortfolio from './AddToExistingPortfolio.vue'
import { PortfolioCardData } from "types/Global";
import PortfolioStore from "@/store/portfolio";
import AcquisitionPackage from "@/store/acquisitionPackage";
import PortfolioSummary from "@/store/portfolioSummary";
import portfolioSummaryListMock 
  from '../../store/portfolioSummary/mocks/portfolioSummaryListMock.json'
import { PortfolioSummaryDTO } from "@/api/models";


Vue.use(Vuetify);
const mockRoute = {
  params: {
    id: 1,
  },
  name: "Awarded_Task_Order"
};
const mockRouter = {
  push: jest.fn(),
};

const mockCardData: PortfolioCardData = {
  isSelected: false,
  lastUpdated: '01/02/03',
  sysId: '1234',
  title: 'test card',
  status: 'Active',
  agencyDisplay: 'AWS',
  fundingOnTrack: true,
  taskOrderNumber: '4321',
  lastModifiedStr: 'Last modified 01/02/03'
}

describe("Testing AddToExistingPortfolio", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(AddToExistingPortfolio, {
      vuetify,
      localVue,
      mocks: {
        $route: mockRoute,
        $router: mockRouter,
      },
    });
  });

  afterEach(()=>{
    jest.clearAllMocks();
  })


  describe("testing AddToExistingPortfolio", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    })

    it('tests loadOnEnter', async () =>{
      jest.spyOn(PortfolioSummary, 'getAllPortfolioSummaryList').mockResolvedValue( 
        portfolioSummaryListMock as unknown as PortfolioSummaryDTO[]
      )
      await wrapper.vm.loadOnEnter();
      expect(wrapper.vm.$data.portfolioCardData.length).toBe(1)
    })

    it("getPortfolioStatus() empty string", async () => {
      expect(wrapper.vm.getPortfolioStatus('')).toBe('');
    })
    it("getPortfolioStatus() active", async () => {
      expect(wrapper.vm.getPortfolioStatus('ACTIVE')).toBe('Active');
    })
  
    it("packageSelected() => index 0", async () => {
      wrapper.setData({portfolioCardData: [
        mockCardData
      ]})
      const mockSetCurrentPorfolio = jest.spyOn(PortfolioStore, 'setCurrentPortfolio')
        .mockImplementation()
      const mocksetDisableContinue = jest.spyOn(AcquisitionPackage, "setDisableContinue")
        .mockImplementation()
      const mockSetProvisioningTOFollowon = jest.spyOn(PortfolioStore, 'setProvisioningTOFollowOn')
        .mockImplementation()
      
      await wrapper.vm.packageSelected(0);
      expect(mockSetCurrentPorfolio).toBeCalledWith(mockCardData)
      expect(mocksetDisableContinue).toBeCalledWith(false)
      expect(mockSetProvisioningTOFollowon).toBeCalledWith(true)
    })

    it("getChipColor() active", async () => {
      expect(wrapper.vm.getChipColor('ACTIVE')).toBe('bg-success');
    })
    
  });
});