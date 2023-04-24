/* eslint-disable camelcase */
import { SystemChoiceDTO } from "../models";
import { TableApiBase } from "../tableApiBase";

const TABLENAME = "sys_choice";

/**
 * Api extention to retrieve table column choice values
 */
export class SystemChoicesApi extends TableApiBase<SystemChoiceDTO> {
  constructor() {
    super(TABLENAME);
  }

  public async getChoices(tableName: string, choiceColumnName: string): Promise<SystemChoiceDTO[]>{

    try{
      return await this.all({
        params: {
          sysparm_fields: 'label,value,name,hint',
          name: tableName,
          element: choiceColumnName,
        }
      });

    } catch (error) {
      throw new Error(`unable to retrieve system choices for 
      (table:${tableName}, choice: ${choiceColumnName}`);
    }

  }

}