import React, { useState } from 'react';
import { useAuth0 } from 'react-auth0-spa';
import { useDispatch, useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { sendMessage } from 'features/chat/chatSlice';
import styles from './MessageEditor.module.scss';
import './MessageEditor.scss';

const MessageEditor = () => {
  const { user } = useAuth0();
  const peer = useSelector((state) => state.session.peer);
  const dispatch = useDispatch();
  const [text, setText] = useState('');

  const handleChange = (value) => setText(value);

  const handleKeyPressed = (event) => {
    if (event.key === 'Enter') {
      if (event.ctrlKey) {
        event.preventDefault();
        dispatch(sendMessage({ self: user.sub, peer, message: text }));
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
    />
  );
};
export default MessageEditor;
