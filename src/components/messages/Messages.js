import React from 'react';
import { useSelector } from 'react-redux';
import Message from 'components/messages/Message';
import styles from './Messages.module.scss';

const Messages = () => {
  const peer = useSelector((state) => state.session.peer);
  const messages = useSelector(
    (state) => state.chat.conversation && state.chat.conversation[peer] || [],
  );
  return (
    <div className={styles.messages}>
      {messages.map(
        (m, i) => <Message key={`${peer}-${i}`} data={m} />,
      )}
    </div>
  );
};

export default Messages;
