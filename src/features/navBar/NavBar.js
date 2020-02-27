import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styles from 'features/navBar/NavBar.module.scss';
import {
  Button, Col, Container, Row,
} from 'react-bootstrap';
import { useAuth0 } from 'react-auth0-spa';
import { checkin, loginSuccess } from 'features/session/sessionSlice';

const NavBar = () => {
  const {
    isAuthenticated, loginWithRedirect, logout, getTokenSilently, user,
  } = useAuth0();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      return;
    }

    async function fetchData() {
      try {
        const token = await getTokenSilently();
        dispatch(checkin({ token, user }));
      } catch (error) {
        console.error(error);
      }
    }

    // We will generate key pairs upon successful logging in
    dispatch(loginSuccess());

    fetchData().then((f) => f);
  }, [user]);
  return (
    <Container>
      <Row className={`${styles.navBar} mx-auto`}>
        <Col xs={2} />
        <Col xs={8} className={styles.title}>Welcome to PipChat</Col>
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
