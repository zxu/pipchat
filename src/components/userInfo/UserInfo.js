import React from 'react';
import { useAuth0 } from 'react-auth0-spa';
import styles from './UserInfo.module.scss';

const UserInfo = () => {
  const { user: { name, sub } } = useAuth0();
  // console.log('User================', user);
  return (
    <div className={styles.userInfo}>
      <div className={styles.title}>Logged in as</div>
      <div className={styles.name}>{name}</div>
      <code className={styles.sub}>{sub}</code>
    </div>
  );
};

export default UserInfo;
