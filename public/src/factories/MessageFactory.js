export const MessageFactory = {
  user: (id, text) => JSON.stringify({ role: "user", id, text }),
};
