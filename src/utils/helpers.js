import {
  decodeBase64,
  decodeUTF8,
  encodeBase64,
  encodeUTF8,
} from 'tweetnacl-util';

export const encodeKey = (keyPair) => encodeBase64(
  decodeUTF8(JSON.stringify(keyPair)),
);

export const decodeKeyPair = (encodedKeyPair) => {
  const decoded = JSON.parse(encodeUTF8(decodeBase64(encodedKeyPair)));

  decoded.publicKey = new Uint8Array(Object.values(decoded.publicKey));
  decoded.secretKey = new Uint8Array(Object.values(decoded.secretKey));

  return decoded;
};

export const decodeKey = (key) => new Uint8Array(
  Object.values(JSON.parse(encodeUTF8(decodeBase64(key)))),
);
