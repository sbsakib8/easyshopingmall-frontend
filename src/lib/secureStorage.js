import { encryptData, decryptData } from "./encryption";

const STORAGE_PREFIX = "enc_";

export const secureStorage = {
  setItem(key, value) {
    if (typeof window === "undefined") return;
    try {
      const encrypted = encryptData(value);
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, encrypted);
    } catch (error) {
      console.error("SecureStorage: Failed to encrypt and store data:", error);
    }
  },

  getItem(key) {
    if (typeof window === "undefined") return null;
    try {
      const encrypted = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (!encrypted) {
        const plain = localStorage.getItem(key);
        if (plain) {
          try {
            return JSON.parse(plain);
          } catch {
            return plain;
          }
        }
        return null;
      }
      return decryptData(encrypted);
    } catch (error) {
      console.error("SecureStorage: Failed to decrypt data:", error);
      return null;
    }
  },

  removeItem(key) {
    if (typeof window === "undefined") return;
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    localStorage.removeItem(key);
  },

  clear() {
    if (typeof window === "undefined") return;
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith(STORAGE_PREFIX) || key === "user")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  },

  migrateExistingData() {
    if (typeof window === "undefined") return;
    const keysToMigrate = ["user"];
    keysToMigrate.forEach((key) => {
      const existing = localStorage.getItem(key);
      if (existing && !localStorage.getItem(`${STORAGE_PREFIX}${key}`)) {
        this.setItem(key, existing);
        localStorage.removeItem(key);
      }
    });
  },
};
