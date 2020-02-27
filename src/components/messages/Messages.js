import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Message from 'components/messages/Message';
import styles from './Messages.module.scss';

const Messages = () => {
  const peer = useSelector((state) => state.session.peer);
  const peers = useSelector((state) => state.session.peers);
  const messages = useSelector(
    (state) => (state.chat.conversation && state.chat.conversation[peer]) || [],
  );
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.scrollTop = inputRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className={styles.messagesContainer}>
      {peer && peers && <div className={styles.title}>{`Conversation with ${peers.find((p) => p.id === peer).name}`}</div>}
      <div className={styles.messages} ref={inputRef}>
        {messages.map(
          (m, i) => <Message key={`${peer}-${i}`} data={m} />,
        )}
      </div>
    </div>
  );
};

export default Messages;
