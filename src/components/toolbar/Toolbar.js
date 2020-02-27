import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'react-bootstrap';
import styles from './Toolbar.module.scss';

const Toolbar = (props) => (
  <div className={styles.toolbarContainer}>
    <Button onClick={props.handleSendMessage} disabled={props.disabled}>Send</Button>
  </div>
);

Toolbar.propTypes = {
  handleSendMessage: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default Toolbar;
