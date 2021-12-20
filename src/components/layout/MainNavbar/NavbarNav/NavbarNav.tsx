import React from "react";
import { Nav } from "shards-react";

import Notifications from "./Notifications";
import UserActions from "./UserActions";
import './NavbarNav.css'

export default () => (
  <Nav navbar className="border-left flex-row flex-right">
    {/* <Notifications /> */}
    <UserActions />
  </Nav>
);
