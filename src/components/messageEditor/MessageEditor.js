import React from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';

const MessageEditor = () => {
  const handleKeyPressed = (event) => {
    if (event.key === 'Enter') {
      console.log('Enter pressed');
      event.preventDefault();
      return;
    }
    console.log(event, event.keyCode);
  };
  return (
    <InputGroup>
      <FormControl
        as="textarea"
        aria-label="message to send"
        onKeyPress={handleKeyPressed}
      />
    </InputGroup>
  );
};
export default MessageEditor;
