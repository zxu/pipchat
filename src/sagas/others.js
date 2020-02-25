import { put, take } from '@redux-saga/core/effects';
import { loginSuccess, saveKeyPair } from 'features/session/sessionSlice';
import { generateKeyPair } from 'utils/encryption.ts';
import { encodeKey } from 'utils/helpers';

export function* otherSideEffects() {
  while (true) {
    const action = yield take([loginSuccess]);

    console.log('Login success. Generate key pair now.');

    const keyPair = generateKeyPair();

    const encodedKeyPair = encodeKey(keyPair);

    yield put(saveKeyPair({ keyPair: encodedKeyPair }));
  }
}
