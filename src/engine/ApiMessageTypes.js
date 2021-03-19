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

function handleMsg(api, handlerName, socket, ...args) {
    api.log && api.log({ log: 'INCOMING', id: socket.id, handlerName, ...args });
    return api[handlerName](socket, ...args);
}

const useApiMessageTypes = (api, socket) => {
    ApiMessageTypes.forEach(
        ([msgType, handlerName]) =>
            api[handlerName] && socket.on(msgType, (...args) => handleMsg(api, handlerName, socket, ...args)),
    );
};

export { useApiMessageTypes };
