import React from 'react';
import * as PropTypes from 'prop-types';
import styles from 'components/peerList/Peer.module.scss';
import {useDispatch, useSelector} from 'react-redux';
import { choosePeer } from 'features/session/sessionSlice';

const Peer = (props) => {
  const { name, id } = props;
  const dispatch = useDispatch();
  const peer = useSelector((state) => state.session.peer);
  console.log(choosePeer, choosePeer.toString());

  return (
    <div
      data-id={id}
      className={`${styles.peer} ${id === peer?styles.selected:''}`}
      onClick={() => dispatch(choosePeer(id))}
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
