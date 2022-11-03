/* eslint-disable camelcase */
import {RequirementsCostEstimateAttachmentService} from
  "@/services/attachment/reqCostEstimateSupportingDocs";
import {RequirementsCostEstimateApi} from "@/api/requirementsCostEstimate";
import {AttachmentServiceCallbacks} from "@/services/attachment";

const id = "test"; // pragma: allowlist secret
const tableName = "estimate";
let tableApi: RequirementsCostEstimateApi;

describe("RequirementsCostEstimateAttachmentService", () => {
  it("service exists", () => {
    expect(new RequirementsCostEstimateAttachmentService(id, tableName, tableApi))
      .toBeDefined();
  });

  it("Test remove()- should make proper call outs to remove the attachment", async () => {
    const reqCostEstimateAttachmentService =
      new RequirementsCostEstimateAttachmentService(id, tableName, tableApi);
    jest.spyOn(reqCostEstimateAttachmentService.attachmentApi, "remove").mockReturnValue(
      Promise.resolve()
    )
    await reqCostEstimateAttachmentService
      .remove({table_sys_id: "12", file_name: "Test Attachment"})
    expect(reqCostEstimateAttachmentService.attachmentApi.remove).toHaveBeenCalled();
  });

  it("Test remove()- should handle the error returned by call out functions", async () => {
    const reqCostEstimateAttachmentService =
      new RequirementsCostEstimateAttachmentService(id, tableName, tableApi);
    jest.spyOn(reqCostEstimateAttachmentService.attachmentApi, "remove")
      .mockImplementation(() => {
        throw new Error();
      })
    jest.spyOn(AttachmentServiceCallbacks, "invokeRemoveCallbacks");
    try{
      await reqCostEstimateAttachmentService
        .remove({table_sys_id: "12", file_name: "Test Attachment"});
    } catch {
      expect(AttachmentServiceCallbacks.invokeRemoveCallbacks).not.toHaveBeenCalled();
    }
  });

  it("Test remove()- should throw an error when attachment passed is null", async () => {
    const reqCostEstimateAttachmentService =
      new RequirementsCostEstimateAttachmentService(id, tableName, tableApi);
    jest.spyOn(reqCostEstimateAttachmentService.attachmentApi, "remove")
      .mockImplementation(() => {
        throw new Error();
      })
    try{
      await reqCostEstimateAttachmentService
        .remove(undefined);
    } catch {
      expect(reqCostEstimateAttachmentService.attachmentApi.remove).not.toHaveBeenCalled();
    }
  });
});
