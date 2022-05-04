import { ContactDTO as ContactDTO } from "../models";
import { TableApiBase } from "../tableApiBase";

export const TABLENAME = "x_g_dis_atat_contacts";

export class ContactsApi extends TableApiBase<ContactDTO> {
  constructor() {
    super(TABLENAME);
  }

}
