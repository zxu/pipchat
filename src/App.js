import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import NavBar from 'components/NavBar';
import { useAuth0 } from 'react-auth0-spa';
import styles from 'App.module.scss';

const App = () => {
  const { loading } = useAuth0();
  return (
    <div>
      <NavBar />
      <Container className={styles.rootPane}>
        {loading && <div>Loading...</div>}
        {!loading
          && (
          <Row>
            <Col>User List</Col>
            <Col xs={8}>Chats</Col>
          </Row>
          )}
      </Container>
    </div>
  );
};

export default App;
