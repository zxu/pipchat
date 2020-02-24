import { put, take } from '@redux-saga/core/effects';
import {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64,
} from 'tweetnacl-util';
import { loginSuccess, saveKeyPair } from 'features/session/sessionSlice';
import { generateKeyPair } from 'utils/encryption.ts';
import {encodeKeyPair, decodeKeyPair} from 'utils/helpers';

export function* otherSideEffects() {
  while (true) {
    const action = yield take([loginSuccess]);

    console.log('Login success. Generate key pair now.');

    const keyPair = generateKeyPair();

    console.log('Key pair', keyPair);

    const encodedKeyPair = encodeKeyPair(keyPair);

    console.log('decoded key pair', decodeKeyPair(encodedKeyPair));

    yield put(saveKeyPair({ keyPair: encodedKeyPair }));
  }
}
