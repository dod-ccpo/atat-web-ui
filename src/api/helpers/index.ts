import { BaseTableDTO, ReferenceColumn } from "../models"

export const convertColumnReferencesToValues = <TableDTO extends BaseTableDTO> 
  (dto: TableDTO): TableDTO => {

  const record = (dto as unknown) as Record<string, string>;

  let k: keyof TableDTO;
  for (k in dto) {  
    const v = dto[k]; 
    const refColumn =(v as unknown) as ReferenceColumn;

    if(refColumn.value){
      record[k.toString()] = refColumn.value;
    }

  }

  return JSON.parse(JSON.stringify(record)) as TableDTO;
}