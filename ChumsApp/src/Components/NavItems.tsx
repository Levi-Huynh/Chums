import React from "react";
import { UserHelper } from "./";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface Props {
  prefix?: String;
  toggleUserMenu?: (e: React.MouseEvent) => void;
}

export const NavItems: React.FC<Props> = (props) => {
  const location = useLocation();

  const getSelected = (): string => {
    var url = location.pathname;
    var result = "people";
    if (url.indexOf("/groups") > -1) result = "groups";
    if (url.indexOf("/attendance") > -1) result = "attendance";
    if (url.indexOf("/donations") > -1) result = "donations";
    if (url.indexOf("/forms") > -1) result = "forms";
    if (url.indexOf("/settings") > -1) result = "settings";

    return result;
  };

  const getClass = (sectionName: string): string => {
    if (sectionName === getSelected()) return "nav-link active";
    else return "nav-link";
  };

  const getTab = (key: string, url: string, icon: string, label: string) => {
    return (
      <li key={key} className="nav-item" onClick={props.toggleUserMenu} id={(props.prefix || "") + key + "Tab"} >
        <Link className={getClass(key)} to={url}>
          <i className={icon}></i> {label}
        </Link>
      </li>
    );
  };

  const getTabs = () => {
    var tabs = [];
    tabs.push(getTab("people", "/people", "fas fa-user", "People"));
    if (UserHelper.checkAccess("Groups", "View")) tabs.push(getTab("groups", "/groups", "fas fa-list-ul", "Groups"));
    if (UserHelper.checkAccess("Attendance", "View Summary")) tabs.push(getTab("attendance", "/attendance", "far fa-calendar-alt", "Attendance"));
    if (UserHelper.checkAccess("Donations", "View Summary")) tabs.push(getTab("donations", "/donations", "fas fa-hand-holding-usd", "Donations"));
    if (UserHelper.checkAccess("Forms", "View")) tabs.push(getTab("forms", "/forms", "fas fa-align-left", "Forms"));
    if (UserHelper.checkAccess("Roles", "View")) tabs.push(getTab("settings", "/settings", "fas fa-cog", "Settings"));
    return tabs;
  };

  return <>{getTabs()}</>;
};
