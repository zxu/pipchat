import axios from 'axios';
import { baseURL } from 'utils/env';

// eslint-disable-next-line import/prefer-default-export
export const checkinWithServer = async ({ token, user }) => {
  const { data } = await axios.post(`${baseURL(process.env.NODE_ENV)}/api/checkin`,
    { user },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

  return data;
};
