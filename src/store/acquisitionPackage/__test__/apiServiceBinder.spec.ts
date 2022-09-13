import api from "@/api";
import { getApiService } from "../apiServiceBinder";
import { StoreProperties } from "../storeproperties";


describe("API Service Binder", () => {

  test("service exists", ()=>{
    expect(getApiService).toBeDefined();
  });

  test("can locate service", () => {
    for (const [key] of Object.entries(StoreProperties)) {
      const storeProps = StoreProperties as Record<string, string>;
      const service = getApiService(storeProps[key]);
      expect(service).toBeDefined();
    }
  });

  test("should throw for none existing service", () => {
    expect(()=> {getApiService('stun')}).toThrow('unable to locate service for key stun');
  });

});