import baseApi from "../base";
import {UserData} from "../../models/User";

const END_POINT = '/now/table/sys_user';

export  class UsersApi extends baseApi  {
  async getAllUsers(): Promise<UserData[]>{
    const response =  await this.instance.get(END_POINT);
    const data = response.data;
    return data.result as UserData[];

  }
}