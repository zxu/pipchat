/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { decodeKeyPair, encodeKey } from 'utils/helpers';

export const slice = createSlice({
  name: 'chat',
  initialState: {
    conversation: {},
  },
  reducers: {
    send(state, { payload }) {
      console.log(payload);

      const { peer } = payload;
      if (!(peer in state.conversation)) {
        state.conversation[peer] = [];
      }
      state.conversation[peer].push(payload);
    },
    receive(state, { payload }) {
      const { self: peer } = payload;
      if (!(peer in state.conversation)) {
        state.conversation[peer] = [];
      }
      state.conversation[peer].push(payload);
    },
    // requestPublicKey(state, { payload }) {
    //   console.log('Requesting peer\'s public key', payload.peer);
    // },
  },
});

function fetchPublicKey(state, peer) {
  const { session: { peers } } = state;
  const { publicKey } = peers.find((p) => p.id === peer);

  return publicKey;
}

// export const requestPublicKey = ({ peer }) => async (dispatch, getState) => {
//   console.log('Requesting peer\'s public key');
// };

export const {
  send, receive, // requestPublicKey,
} = slice.actions;

export const sendPublicKey = ({ peer }) => async (dispatch, getState) => {
  console.log('Was asked to send public key');
  const { session: { user: { sub: self }, keyPair } } = getState();
  const { publicKey } = decodeKeyPair(keyPair);
  dispatch(send({
    self, peer, publicKey: encodeKey(publicKey), request: 'key',
  }));
};

export const sendMessage = ({ self, peer, message }) => async (dispatch, getState) => {
  const publicKey = fetchPublicKey(getState(), peer);
  if (!publicKey) {
    dispatch(send({ self, peer, request: 'key' }));
  }
};

export default slice.reducer;
