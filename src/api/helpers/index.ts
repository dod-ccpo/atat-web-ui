import { BaseTableDTO, DisplayColumn, ReferenceColumn } from "../models"

export const convertColumnReferencesToValues = <TableDTO extends BaseTableDTO> 
  (DTO: TableDTO): TableDTO => {

  const record = (DTO as unknown) as Record<string, string>;

  let key: keyof TableDTO;
  for (key in DTO) {  
    const keyValue = DTO[key]; 
    
    if (keyValue) {
      const refColumn = (keyValue as unknown) as ReferenceColumn;

      if (refColumn.value !== undefined) {
        record[key.toString()] = refColumn.value;
      }  
    }
  }

  return JSON.parse(JSON.stringify(record)) as TableDTO;
}

export const convertDisplayColumnsToDisplayValues = <TableDTO extends BaseTableDTO> 
  (DTO: TableDTO, columns?: string[]): TableDTO => {

  const record = (DTO as unknown) as Record<string, string>;

  let key: keyof TableDTO;
  for (key in DTO) {  
    const keyValue = DTO[key]; 
    
    if (keyValue) {
      const refColumn = (keyValue as unknown) as DisplayColumn;

      if (refColumn.display_value !== undefined && (!columns || columns.includes(key))) {
        record[key.toString()] = refColumn.display_value;
      }  
    }
  }

  return JSON.parse(JSON.stringify(record)) as TableDTO;
}