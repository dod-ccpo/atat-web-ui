import { PackageDocumentsUnsignedDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
export const TABLENAME = "x_g_dis_atat_package_documents_unsigned";
export class PackageDocumentsUnsignedAPI extends TableApiBase<PackageDocumentsUnsignedDTO> {
  constructor() {
    super(TABLENAME);
  }

}
