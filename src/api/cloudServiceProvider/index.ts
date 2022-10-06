import {TableApiBase} from "@/api/tableApiBase";
import {CloudServiceProviderDTO} from "@/api/models";

const TABLENAME = "x_g_dis_atat_cloud_service_provider";

export class CloudServiceProviderApi extends TableApiBase<CloudServiceProviderDTO> {
  constructor() {
    super(TABLENAME);
  }
}
