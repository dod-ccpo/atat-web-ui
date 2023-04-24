import { PackageDocumentsSignedDTO} from "../models";
import { TableApiBase } from "../tableApiBase";
export const TABLENAME = "x_g_dis_atat_package_documents_signed";
export class PackageDocumentsSignedAPI extends TableApiBase<PackageDocumentsSignedDTO> {
  constructor() {
    super(TABLENAME);
  }

}
