export const MessageFactory = {
  char: (value) => JSON.stringify({ type: "char", value }),
  end:  ()      => JSON.stringify({ type: "end" }),
};
