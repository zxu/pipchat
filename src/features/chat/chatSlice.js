/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { decodeKey, decodeKeyPair, encodeKey } from 'utils/helpers';
import { decrypt, encrypt } from 'utils/encryption';

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
  },
});

/**
 * Fetch peer's public key from the peer list.
 * Return undefined if not found.
 *
 * @param state
 * @param peer
 * @returns {*}
 */
const fetchPeerPublicKey = (state, peer) => {
  const { session: { peers } } = state;
  const { publicKey } = peers.find((p) => p.id === peer);

  return publicKey;
};

/**
 * Fetch own public key.
 *
 * @param state
 * @param peer
 * @returns {*}
 */
const fetchPublicKey = (state) => {
  const { session: { keyPair } } = state;

  const { publicKey } = decodeKeyPair(keyPair);

  return publicKey;
};

/**
 * Fetch own keys.
 *
 * @param state
 */
const fetchKeys = (state) => {
  const { session: { keyPair } } = state;

  const { publicKey, secretKey } = decodeKeyPair(keyPair);

  return { publicKey, secretKey };
};

// export const requestPublicKey = ({ peer }) => async (dispatch, getState) => {
//   console.log('Requesting peer\'s public key');
// };

export const {
  send, receive,
} = slice.actions;

/**
 * Send own public key to peer upon request
 * @param peer
 * @returns {Function}
 */
export const sendPublicKey = ({ peer }) => async (dispatch, getState) => {
  console.log('Was asked to send public key');
  const { session: { user: { sub: self }, keyPair } } = getState();
  const { publicKey } = decodeKeyPair(keyPair);

  console.log('********************* original key', publicKey);
  console.log('********************* encoded key', encodeKey(publicKey));
  console.log('********************* decoded key', decodeKey(encodeKey(publicKey)));

  dispatch(send({
    self, peer, publicKey: encodeKey(publicKey), request: 'keyResponse',
  }));
};

export const sendMessage = ({ self, peer, message }) => async (dispatch, getState) => {
  const { secretKey } = fetchKeys(getState());
  const publicKey = fetchPeerPublicKey(getState(), peer);

  console.log('==========================', decodeKey(publicKey));

  const encryptedMessage = encrypt(secretKey, message, decodeKey(publicKey));
  dispatch(send({
    self, peer, message, encryptedMessage,
  }));
};

export const receiveMessage = ({ self, message, encrypted }) => async (dispatch, getState) => {
  if (encrypted) {
    const { secretKey } = fetchKeys(getState());
    console.log('********************* peer', self);
    const publicKey = fetchPeerPublicKey(getState(), self);
    console.log('************************ peer public key', publicKey);
    console.log('************************ peer public key decoded', decodeKey(publicKey));
    message = decrypt(secretKey, message, decodeKey(publicKey));
  }
  dispatch(receive({ self, message }));
};

export const exchangeKeys = ({ self, peer }) => async (dispatch, getState) => {
  const publicKey = fetchPeerPublicKey(getState(), peer);
  if (!publicKey) {
    // Sending own public key along with the request for the peer's key
    const ownPublicKey = fetchPublicKey(getState());
    dispatch(send({
      self, peer, request: 'keyRequest', publicKey: encodeKey(ownPublicKey),
    }));
  }
};

export default slice.reducer;
