import React from 'react';
import {Button, FormControl, InputGroup} from 'react-bootstrap';
import styles from 'components/messageEditor/MessageEditor.module.scss';

const MessageEditor = () => {
  // console.log('here styles', styles.messageEditor);
  return (
      <InputGroup className={styles.messageInput}>
        <FormControl as="textarea" aria-label="message to send" />
      </InputGroup>
  );
};

export default MessageEditor;
