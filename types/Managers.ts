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
  
export interface PortfolioManagersPermission {
    id: string;
    label: string;
    description: string;
}
export interface PortfolioManagersPermissions {
    [id: string]: PortfolioManagersPermission;
}