import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "easyshop-frontend-secret-key-2024";

export const encryptData = (data) => {
  if (!data) return data;
  const jsonString = typeof data === "string" ? data : JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
};

export const decryptData = (cipherText) => {
  if (!cipherText) return cipherText;
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, ENCRYPTION_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedString) return null;
    try {
      return JSON.parse(decryptedString);
    } catch {
      return decryptedString;
    }
  } catch {
    return null;
  }
};

export const encryptPayload = (payload, sensitiveFields = []) => {
  if (!payload || typeof payload !== "object") return payload;
  const encrypted = { ...payload };
  sensitiveFields.forEach((field) => {
    if (encrypted[field] !== undefined && encrypted[field] !== null) {
      encrypted[field] = encryptData(encrypted[field]);
    }
  });
  return encrypted;
};

export const hashData = (data) => {
  return CryptoJS.SHA256(String(data)).toString();
};
