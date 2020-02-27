/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { decodeKey, decodeKeyPair, encodeKey } from 'utils/helpers';
import { decrypt, encrypt } from 'utils/encryption.ts';
import moment from 'moment';

export const slice = createSlice({
  name: 'chat',
  initialState: {
    conversation: {},
    sendQueue: {},
  },
  reducers: {
    send(state, { payload }) {
      if (!('message' in payload)) {
        return;
      }
      const { peer, id } = payload;
      if (!(peer in state.conversation)) {
        state.conversation[peer] = [];
      }
      state.conversation[peer].push(payload);
      state.sendQueue[id] = false;
    },
    receive(state, { payload }) {
      if (!('message' in payload)) {
        return;
      }
      const { self: peer } = payload;
      if (!(peer in state.conversation)) {
        state.conversation[peer] = [];
      }
      state.conversation[peer].push(payload);
    },
    receiveAck(state, { payload }) {
      if (payload.id) {
        state.sendQueue[payload.id] = true;
      }
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

export const {
  send, receive, receiveAck,
} = slice.actions;

/**
 * Send own public key to peer upon request
 * @param peer
 * @returns {Function}
 */
export const sendPublicKey = ({ peer }) => async (dispatch, getState) => {
  const { session: { user: { sub: self }, keyPair } } = getState();
  const { publicKey } = decodeKeyPair(keyPair);

  dispatch(send({
    self, peer, publicKey: encodeKey(publicKey), request: 'keyResponse',
  }));
};

export const sendMessage = ({
  self, peer, message, id,
}) => async (dispatch, getState) => {
  const { secretKey } = fetchKeys(getState());
  const publicKey = fetchPeerPublicKey(getState(), peer);

  if (!publicKey || publicKey === '') {
    return;
  }

  try {
    const encryptedMessage = encrypt(secretKey, message, decodeKey(publicKey));
    dispatch(send({
      self, peer, message, encryptedMessage, id, timestamp: moment().format('LT'),
    }));
  } catch (error) {
    console.warn(error);
  }
};

export const receiveMessage = ({ self, message, encrypted }) => async (dispatch, getState) => {
  if (encrypted) {
    const { secretKey } = fetchKeys(getState());
    const publicKey = fetchPeerPublicKey(getState(), self);
    if (publicKey) {
      message = decrypt(secretKey, message, decodeKey(publicKey));
    }
  }
  dispatch(receive({ self, message, timestamp: moment().format('LT') }));
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
