import React from 'react';
import * as PropTypes from 'prop-types';
import styles from 'components/peerList/Peer.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { choosePeer } from 'features/session/sessionSlice';
import { exchangeKeys } from 'features/chat/chatSlice';

const Peer = (props) => {
  const { name, id } = props;
  const dispatch = useDispatch();
  const peer = useSelector((state) => state.session.peer);
  const self = useSelector((state) => state.session.user && state.session.user.sub);
  console.log(choosePeer, choosePeer.toString());

  const handlePeerClick = () => {
    dispatch(choosePeer(id));
    dispatch(exchangeKeys({ self, peer: id }));
  };

  return (
    <div
      data-id={id}
      className={`${styles.peer} ${id === peer ? styles.selected : ''}`}
      onClick={handlePeerClick}
    >
      {name}
    </div>
  );
};

Peer.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default Peer;
