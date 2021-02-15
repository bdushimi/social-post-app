import React, { useState, useContext } from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from "react-router-dom";
import {AuthContext} from '../utils/context'

function MenuBar() {

  const context = useContext(AuthContext);

  const pathname = window.location.pathname;

  const path = pathname === '/'? 'home' : pathname.substr(1);

  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => setActiveItem(name)

  const handleLogout = () => {
    context.logout();
  }

  const userMenuBar = context.user ? (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item
        name={context.user.username}
        as={Link}
        to="/"
      />
      <Menu.Menu position='right'>
        <Menu.Item
          name='logout'
          active={activeItem === 'logout'}
          onClick={handleLogout}
        />
      </Menu.Menu>
    </Menu>
  ) : (
      <Menu pointing secondary size="massive" color="teal">
        <Menu.Item
          name='home'
          active={activeItem === 'home'}
          onClick={handleItemClick}
          as={Link}
          to="/"
        />
        <Menu.Menu position='right'>
          <Menu.Item
            name='login'
            active={activeItem === 'login'}
            onClick={handleItemClick}
            as={Link}
            to="/login"
          />
          <Menu.Item
            name='signup'
            active={activeItem === 'signup'}
            onClick={handleItemClick}
            as={Link}
            to="/signup"
          />
        </Menu.Menu>
      </Menu>
  )

    return userMenuBar
}

export default MenuBar;