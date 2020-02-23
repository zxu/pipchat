import React, { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styles from 'features/navBar/NavBar.module.scss';
import {
  Button, Col, Container, Row,
} from 'react-bootstrap';
import { useAuth0 } from 'react-auth0-spa';
import { checkin } from 'features/session/sessionSlice';

const NavBar = () => {
  const {
    isAuthenticated, loginWithRedirect, logout, getTokenSilently, user,
  } = useAuth0();

  const dispatch = useDispatch();
  const peers = useSelector((state) => state.peers);
  console.log('Peers....', peers);

  useEffect(() => {
    if (!user) {
      return;
    }

    console.log('User', user);

    async function fetchData() {
      try {
        const token = await getTokenSilently();
        dispatch(checkin({ token, user }));
      } catch (error) {
        console.error(error);
      }
    }

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
