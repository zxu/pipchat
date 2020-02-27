import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'react-bootstrap';
import styles from './Toolbar.module.scss';

const Toolbar = (props) => {

  return (
    <div className={styles.toolbarContainer}>
      <Button onClick={props.handleSendMessage}>Send</Button>
    </div>
  );
};

Toolbar.propTypes = {
  handleSendMessage: PropTypes.func.isRequired,
};

export default Toolbar;
