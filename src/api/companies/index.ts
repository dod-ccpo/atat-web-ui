import { TableApiBase } from "../tableApiBase";
import { CompanyDTO } from "@/api/models";

export const TABLENAME = "core_company";

export class CompanyApi extends TableApiBase<CompanyDTO> {
  constructor() {
    super(TABLENAME);
  }
}