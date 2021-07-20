
export interface NavItem {
    title: string;
    url?: string;
    component?: string;
    cssClass?: string;
    newWindow?: string | boolean; // = false | true
    children?: NavItem[]; // = [];
    order?: number;
    attachment?: number;
    parentIndex?: number;
    uuid?: number;
    id?: number;
    icon?: string;
    iconPlacement?: string;
  }

export interface Meta {
  key: string;
  value: string;
}

export interface Nav {
  id: string;
  title: string;
  items: NavItem[];
  meta?: Meta[];
}

export interface Navs {
  [key: string]: Nav;
}
  