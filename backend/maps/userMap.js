let users = new Map();

//users that are searching for 2 players match
let twoPlayersQueue = [];

const addUser = (userId, socketId) => {
  if (!users.has(userId)) {
    users.set(userId, socketId);
  }
};

const removeUser = (socketId) => {
  const userEntries = [...users.entries()];

  const usersEntriesFilterd = userEntries.filter(
    ([_, value]) => value !== socketId
  );

  users = new Map(usersEntriesFilterd);
};

const getUser = (userId) => {
  return users.get(userId);
};

export { users, twoPlayersQueue, addUser, removeUser, getUser };
