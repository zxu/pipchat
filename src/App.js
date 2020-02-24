import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import NavBar from 'features/navBar/NavBar';
import { useAuth0 } from 'react-auth0-spa';
import styles from 'App.module.scss';
import MessageEditor from 'components/messageEditor/MessageEditor';
import PeerList from 'components/peerList/PeerList';
import {useDispatch} from 'react-redux';
import { reCheckin } from 'features/session/sessionSlice';


const App = () => {
  const { loading, user } = useAuth0();
  const dispatch = useDispatch();
  return (
    <div onClick={() => dispatch(reCheckin())}>
      <NavBar />
      <Container className={styles.rootPane}>
        {loading && <div>Loading...</div>}
        {!loading
          && (
          <Row>
            {/*<Col><p>User List</p></Col>*/}
            <Col>{user && <PeerList />}</Col>
            <Col xs={8}>
              <Row className={styles.messages} />
              <Row className={styles.messageEditor}><MessageEditor /></Row>
            </Col>
          </Row>
          )}
      </Container>
    </div>
  );
};

export default App;
