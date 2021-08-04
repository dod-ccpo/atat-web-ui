export interface KeyValuePair {
    [key: string]: any;
}
  
export interface ActionObject {
    action: string;
    data?: KeyValuePair;
}