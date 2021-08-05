export interface Manager {
    name?: string;
    phone?: string;
    email: string;
    permissionSets?: string[];
}
  
export interface PortfolioManagers {
    portfolioID?: string;
    managers: Manager[];
}
  
export interface PortfolioManagerPermission {
    id: string;
    label: string;
    description: string;
    description_note?: string;
}
export interface PortfolioManagerPermissions {
    [id: string]: PortfolioManagerPermission;
}