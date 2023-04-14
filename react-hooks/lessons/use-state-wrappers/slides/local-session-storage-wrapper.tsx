export class PersistentStorage {
  storage?: Storage;

  constructor(type: "local" | "session") {
    try {
      this.storage = type === "local" ? localStorage : sessionStorage;
    } catch (error) {
      console.error("local storage is disabled", error);
    }
  }

  get(key: string): unknown {
    if (!this.storage) {
      return;
    }

    try {
      const storageValue = this.storage.getItem(key);

      if (storageValue === null) {
        return;
      }

      const value = JSON.parse(storageValue);

      return value;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  set(key: string, value: unknown) {
    if (!this.storage) {
      return;
    }

    try {
      const stringifiedValue = JSON.stringify(value);
      this.storage.setItem(key, stringifiedValue);
    } catch (error) {
      console.error(error);
      return;
    }
  }

  has(key: string) {
    if (!this.storage) {
      return false;
    }

    return key in this.storage;
  }

  remove(key: string) {
    if (!this.storage) {
      return;
    }

    this.storage.removeItem(key);
  }

  clear() {
    if (!this.storage) {
      return;
    }

    this.storage.clear();
  }

  get length() {
    if (!this.storage) {
      return 0;
    }
    return this.storage.length;
  }
}

export const localStorageWrapper = new PersistentStorage("local");
export const sessionStorageWrapper = new PersistentStorage("session");
