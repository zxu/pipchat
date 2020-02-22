import axios from 'axios';

const host = (env) => (env === 'production'
  ? 'https://pipchat.herokuapp.com'
  : 'http://localhost:3001');

// eslint-disable-next-line import/prefer-default-export
export const checkinWithServer = async (token) => {
  const { data } = await axios.get(`${host(process.env.NODE_ENV)}/api/external`, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};
