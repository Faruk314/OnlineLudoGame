let games = new Map();

const addToGameMap = (userId, gameId) => {
  if (!games.has(userId)) {
    games.set(userId, gameId);
  }
};

const removeUserFromGameMap = (userId) => {
  const userEntries = [...games.entries()];

  const usersEntriesFilterd = userEntries.filter(
    ([key, value]) => key !== userId
  );

  games = new Map(usersEntriesFilterd);
};

const getGameId = (userId) => {
  return games.get(userId);
};

export { addToGameMap, removeUserFromGameMap, getGameId, games };
