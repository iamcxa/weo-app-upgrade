import CryptoJS from "crypto-js";
import Config from "~/Config";

const key = CryptoJS.enc.Utf8.parse(Config.aes.key);
const iv = CryptoJS.enc.Utf8.parse(Config.aes.iv);

export function encrypt(str) {
  const encrypted = CryptoJS.AES.encrypt(str, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
  });
  return encrypted.toString();
}

export function decrypt(str) {
  const decrypted = CryptoJS.AES.decrypt(str, key, {
    iv,
    padding: CryptoJS.pad.ZeroPadding,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
