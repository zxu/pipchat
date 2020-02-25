import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import styles from './Message.module.scss';

const Message = (props) => {
  const self = useSelector((state) => state.session.user && state.session.user.sub);
  const { data: { self: sender, message } } = props;
  return (
    <div className={`${styles.messageContainer} ${self === sender
      ? styles.self
      : styles.peer}`}
    >
      <div className={`${styles.message} ${self === sender
        ? styles.self
        : styles.peer}`}
      >
        {message}
      </div>
      <br />
    </div>
  );
};

Message.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Message;
