import { GInvoicingApi, ENDPOINTNAME } from './index';
import MockAdapter from "axios-mock-adapter";
import {createLocalVue} from "@vue/test-utils";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);
describe("GInvoicingApi ", () => {
  const ginvoicingApi = new GInvoicingApi();
  const mockAxios = new MockAdapter(ginvoicingApi.instance);
 
  afterEach(() => {
    jest.clearAllMocks();
    mockAxios.reset();
  });

  describe("searchGtc()=>", () => {
    it('tests getting valid GTC number successfully', async () => {
      const packageId = '1234';
      const gtcNumber = "A2110-097-097-005307";
      const expectedResponse = { valid: true, message: "Success" };
  
      mockAxios.onGet(`${ENDPOINTNAME}/gtc_validation`, { 
        params: { 
          gtcNumber: gtcNumber,
          acquisitionPackageId: packageId 
        }
      }).reply(200, { result: "Success" });
  
      const data = await ginvoicingApi.searchGtc(gtcNumber, packageId);
  
      expect(data).toEqual(expectedResponse);
    });
  
    it('tests erroring successfully', async () => {
      const packageId = '1234';
      const gtcNumber = "A2110-097-097-005307";
      const expectedResponse = { valid: false, message: "unknown error" };
  
      mockAxios.onGet(`${ENDPOINTNAME}/gtc_validation`, { 
        params: { 
          gtcNumber: gtcNumber,
          acquisitionPackageId: packageId 
        }
      }).networkError();
  
      const data = await ginvoicingApi.searchGtc(gtcNumber, packageId);
  
      expect(data).toEqual(expectedResponse);
    });

  })

  describe("order number search()=>", () => {

    it('tests getting valid order number successfully', async () => {
      const packageId = '1234';
      const orderNumber = "ORD-005307";
      const expectedResponse = { valid: true, message: "Order valid" };
  
      mockAxios.onGet(`${ENDPOINTNAME}/order_validation`, { 
        params: { 
          orderNumber: orderNumber,
          acquisitionPackageId: packageId 
        }
      }).reply(200, { result: "Order valid" });
      const data = await ginvoicingApi.searchOrder(orderNumber, packageId);
      expect(data).toEqual(expectedResponse);
    });
  
    it('tests erroring successfully', async () => {
      const packageId = '1234';
      const gtcNumber = "A2110-097-097-005307";
      const expectedResponse = { valid: false, message: "unknown error" };
      mockAxios.onGet(`${ENDPOINTNAME}/order_validation`, { 
        params: { 
          gtcNumber: gtcNumber,
          acquisitionPackageId: packageId 
        }
      }).networkError();
      const data = await ginvoicingApi.searchGtc(gtcNumber, packageId);
      expect(data).toEqual(expectedResponse);
    });
  })

 

});