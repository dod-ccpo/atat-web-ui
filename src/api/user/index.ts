import { TableApiBase } from "../tableApiBase";
import { UserDTO } from "@/api/models";

export const TABLENAME = "sys_user";

export class UserApi extends TableApiBase<UserDTO> {
  constructor() {
    super(TABLENAME);
  }
}