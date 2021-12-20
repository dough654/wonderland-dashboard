import React from "react";
import { Nav } from "shards-react";

import ConnectMenu from "./ConnectMenu";
import './NavbarNav.css'

export default () => (
  <Nav navbar className="border-left flex-row flex-right">
    {/* <Notifications /> */}
    <ConnectMenu />
  </Nav>
);
