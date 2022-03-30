import { ContactDTO as ContactDTO } from "@/models/ContactDTO";
import { TableApiBase } from "../tableApiBase";

const TABLENAME = "x_g_dis_atat_contacts";

export class ContactsApi extends TableApiBase<ContactDTO> {
  constructor() {
    super(TABLENAME);
  }

}
