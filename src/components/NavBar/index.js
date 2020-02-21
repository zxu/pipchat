import React from 'react';
import styles from 'components/NavBar/style.module.scss';
import {
  Button, Col, Container, Row,
} from 'react-bootstrap';
import { useAuth0 } from 'react-auth0-spa';

const NavBar = () => {
  console.log('===================', useAuth0());
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  return (
    <Container>
      <Row className={`${styles.mainTitle} mx-auto`}>
        <Col xs={2} />
        <Col xs={8}>Welcome to PipChat</Col>
        <Col xs={2} className={`${styles.loginButton}`}>
          {!isAuthenticated && (
            <Button
              variant="outline-info"
              onClick={() => loginWithRedirect({})}
            >
              Log in
            </Button>
          )}
          {isAuthenticated
            && (
            <Button variant="outline-info" onClick={() => logout()}>
              Log out
            </Button>
            )}
        </Col>
      </Row>
    </Container>
  );
};

export default NavBar;
