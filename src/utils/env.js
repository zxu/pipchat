/* eslint-disable import/prefer-default-export */
export const baseURL = (env) => (env === 'production'
  ? 'https://pipchat-server.herokuapp.com' // process.env.REACT_APP_PIPCHAT_SERVER_URL
  : 'http://localhost:3001');
