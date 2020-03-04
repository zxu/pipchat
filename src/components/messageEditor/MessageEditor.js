import React, { useEffect, useState } from 'react';
import { useAuth0 } from 'react-auth0-spa';
import { useDispatch, useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { v4 as uuid } from 'uuid';
import { sendMessage } from 'features/chat/chatSlice';
import { choosePeer } from 'features/session/sessionSlice';
import Toolbar from 'components/toolbar/Toolbar';
import styles from './MessageEditor.module.scss';
import './MessageEditor.scss';

const MessageEditor = () => {
  const { user } = useAuth0();
  const peer = useSelector((state) => state.session.peer);
  const peerDetails = useSelector((state) => state.session.peers.find((p) => p.id === peer));
  const peerPublicKey = peerDetails && peerDetails.publicKey;

  const dispatch = useDispatch();
  const [text, setText] = useState('');

  const [messageID, setMessageID] = useState(null);
  const messageStatus = useSelector((state) => state.chat.sendQueue[messageID]);

  useEffect(() => {
    if (messageStatus === true) {
      setText('');
    }
  }, [messageStatus]);

  // useEffect(() => {
  //   if (peer && !peerPublicKey) {
  //     console.log('Peer is chosen but public key is not available');
  //     dispatch(choosePeer(peer));
  //   }
  // }, [peer, peerPublicKey]);

  const handleChange = (value) => setText(value);

  const handleSendMessage = () => {
    const id = uuid();
    dispatch(sendMessage({
      self: user.sub, peer, message: text, id,
    }));
    setMessageID(id);
  };

  const handleKeyPressed = (event) => {
    if (event.key === 'Enter') {
      if (event.ctrlKey) {
        event.preventDefault();
        handleSendMessage();
      }
    }
  };
  return (
    <div className={styles.editorContainer}>
      <ReactQuill
        className={styles.editor}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyPressed}
        readOnly={!peer || !peerPublicKey}
        placeholder="Press Control + Enter key to send a message"
      />
      <Toolbar handleSendMessage={handleSendMessage} disabled={text.length === 0 || text === '<p><br></p>'} />
    </div>
  );
};
export default MessageEditor;
