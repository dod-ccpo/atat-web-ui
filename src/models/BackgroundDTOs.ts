export interface CurrentContractExistsDTO {
  sys_mod_count?: string;
  sys_updated_on?: string;
  sys_tags?: string;
  sys_id?: string;
  sys_updated_by?: string;
  sys_created_on?: string;
  sys_created_by?: string;

  current_contract_exists: string;
}

export interface CurrentContractDetailsDTO {
  sys_mod_count?: string;
  sys_updated_on?: string;
  sys_tags?: string;
  sys_id?: string;
  sys_updated_by?: string;
  sys_created_on?: string;
  sys_created_by?: string;

  incumbent_contractor_name: string;
  contract_number: string;
  task_delivery_order_number: string;
  contract_order_expiration_date: string;
}
