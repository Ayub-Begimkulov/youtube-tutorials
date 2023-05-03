const sleep = (ms: number) => {
  return new Promise<void>((res) => {
    setTimeout(() => res(), ms);
  });
};

export const storageAPI = {
  async save(text: string) {
    console.log("[save request]", text);
    await sleep(500);
    localStorage.setItem("saved-text", text);
  },

  async read() {
    await sleep(500);
    return localStorage.getItem("saved-text") || "";
  },
};
