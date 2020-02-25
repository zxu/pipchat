import React from 'react';
import { useSelector } from 'react-redux';
import Peer from 'components/peerList/Peer';
import { useAuth0 } from 'react-auth0-spa';
import styles from 'components/peerList/PeerList.module.scss';

const PeerList = (props) => {
  const { user } = useAuth0();

  const peers = useSelector(
    (state) => state.session.peers.filter((p) => p.id !== user.sub),
  );

  return (
    <div className={styles.peerList}>
      {peers.map((peer) => (
        <Peer key={peer.id} name={peer.name} id={peer.id} />
      ))}
    </div>
  );
};

PeerList.propTypes = {};

export default PeerList;
