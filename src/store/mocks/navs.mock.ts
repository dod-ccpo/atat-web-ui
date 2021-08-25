import { Navs } from "@/../types/NavItem";

export const navs: Navs = {
  logout: {
    id: "atat-nav__logout",
    title: "logout Nav",
    items: [],
  },
  login: {
    id: "atat-nav__login",
    title: "login Nav",
    items: [
      {
        id: 1,
        cssClass: "atat-header-nav__user-display-name",
        title: "Maria Missionowner",
        url: "#",
        newWindow: false,
        icon: "person",
        iconPlacement: "left",
      },
      {
        id: 2,
        cssClass: "atat-header-nav__support",
        title: "Support",
        url: "#",
        newWindow: false,
        icon: "help_outline",
        iconPlacement: "left",
      },
      {
        id: 3,
        cssClass: "atat-header-nav__logout",
        title: "Logout",
        url: "/",
        newWindow: false,
        icon: "logout",
        iconPlacement: "right",
        action: "logout",
      },
    ],
  },
}; // Noncompliant
