import React from 'react';
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {LinkContainer} from 'react-router-bootstrap'
import {useDispatch, useSelector} from "react-redux";
import {userLogout} from "../store/actions/userAction";

const Header = () => {
  const dispatch = useDispatch()
  const {userInfo} = useSelector(state => state.userLogin)

  const logoutHandler = () => {
    dispatch(userLogout())

  }

  return (
    <header>
      <Navbar bg="light" variant="light">
        <Container>
          <LinkContainer to={'/'}>
            <Navbar.Brand>Navbar</Navbar.Brand>
          </LinkContainer>
          <Nav>
            {userInfo ? (
              <NavDropdown title={userInfo.name} id='username'>
                <LinkContainer to={'/profile'}>
                  <NavDropdown.Item>Профиль</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Item onClick={logoutHandler}>Выйти</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <LinkContainer to={'/login'}>
                <Nav.Link>Войти</Nav.Link>
              </LinkContainer>
            )}
            {userInfo && (
                <LinkContainer to={'/profile'}>
                  <Nav.Link>Личный кабинет</Nav.Link>
                </LinkContainer>
            )}
            {userInfo && (userInfo.role === 'ADMIN') && (
              <NavDropdown title="Админ" id='adminmenu'>
                <LinkContainer to='admin/userlist'>
                  <NavDropdown.Item>Пользователи</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='admin/post'>
                  <NavDropdown.Item>Посты</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;