import api from "@/api";
import { getApiService } from "../apiServiceBinder";
import { StoreProperties } from "../storeproperties";


describe("API Service Binder", () => {

  test("can locate service", ()=>{

    const service = getApiService(StoreProperties.ClassificationLevel);
    expect(service).toBe(api.classificationLevelTable);
  });

});