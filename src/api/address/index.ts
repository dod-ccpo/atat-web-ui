import { AddressDTO } from "@/api/models";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "x_g_dis_atat_dapps_address_table";
export class AddressApi extends TableApiBase<AddressDTO> {
  constructor() {
    super(TABLENAME);
  }
}


