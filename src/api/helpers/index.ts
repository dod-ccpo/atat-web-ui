import { BaseTableDTO, ReferenceColumn } from "../models"

export const convertColumnReferencesToValues = <TableDTO extends BaseTableDTO> 
  (DTO: TableDTO): TableDTO => {

  const record = (DTO as unknown) as Record<string, string>;

  let key: keyof TableDTO;
  for (key in DTO) {  
    const keyValue = DTO[key]; 
    
    if (keyValue) {
      const refColumn = (keyValue as unknown) as ReferenceColumn;

      if (refColumn.value) {
        record[key.toString()] = refColumn.value;
      }  
    }
  }

  return JSON.parse(JSON.stringify(record)) as TableDTO;
}
