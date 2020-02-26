import React, { useEffect, useState } from 'react';
import { useAuth0 } from 'react-auth0-spa';
import { useDispatch, useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { v4 as uuid } from 'uuid';
import { sendMessage } from 'features/chat/chatSlice';
import styles from './MessageEditor.module.scss';
import './MessageEditor.scss';

const MessageEditor = () => {
  const { user } = useAuth0();
  const peer = useSelector((state) => state.session.peer);

  const dispatch = useDispatch();
  const [text, setText] = useState('');

  const [messageID, setMessageID] = useState(null);
  const messageStatus = useSelector((state) => state.chat.sendQueue[messageID]);

  useEffect(() => {
    if (messageStatus === true) {
      setText('');
    }
  }, [messageStatus]);

  const handleChange = (value) => setText(value);

  const handleKeyPressed = (event) => {
    if (event.key === 'Enter') {
      if (event.ctrlKey) {
        event.preventDefault();
        const id = uuid();
        dispatch(sendMessage({
          self: user.sub, peer, message: text, id,
        }));
        setMessageID(id);
      }
    }
  };
  return (
    <ReactQuill
      className={styles.editor}
      value={text}
      onChange={handleChange}
      onKeyDown={handleKeyPressed}
      readOnly={!peer}
      placeholder="Press Control + Enter key to send a message"
    />
  );
};
export default MessageEditor;
