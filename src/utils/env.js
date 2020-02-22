/* eslint-disable import/prefer-default-export */
export const baseURL = (env) => (env === 'production'
  ? 'https://pipchat.herokuapp.com'
  : 'http://localhost:3001');
