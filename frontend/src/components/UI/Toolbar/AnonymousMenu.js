import React from 'react';
import {NavItem, NavLink} from "reactstrap";
import {NavLink as RouterNavLink} from "react-router-dom";

const AnonymousMenu = (props) => (
  <>
    <NavItem style={{listStyle: 'none'}}>
      <NavLink style={{color: '#fff'}} tag={RouterNavLink} to={props.to} exact>{props.children}</NavLink>
    </NavItem>
  </>
);

export default AnonymousMenu;