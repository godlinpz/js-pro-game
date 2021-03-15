const ApiMessageTypes = [
    'join',
    'disconnect',
    'welcome',
    'newPlayer',
    'move',
    'playerMove',
    'playerDisconnect',
    'meetPlayers',
    'declineFight',
    'agreeFight',
    'startFight',
    'rejectFight',
    'setDeck',
    'chooseYourHand',
    'commonError',
    'nextTurn',
    'turnDone',
    'fightTimeout',
    'giveUp',
    'fightEnd',
].map((msgType) => [msgType, 'on' + msgType[0].toUpperCase() + msgType.substr(1)]);

const useApiMessageTypes = (api, socket) => {
    ApiMessageTypes.forEach(
        ([msgType, handler]) => api[handler] && socket.on(msgType, (...args) => api[handler](socket, ...args)),
    );
};

export { useApiMessageTypes };
