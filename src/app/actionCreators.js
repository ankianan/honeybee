import {
    SWIPE_TO,
    SWIPE_UP,
    ADD_PLAYER,
    REMOVE_PLAYER,
    UPDATE_PLAYER_STATUS,
    PEER_ON_OPEN,
    PEER_CONNECT,
    PEER_ON_CONNECTION
} from "./actionTypes.js";

const swipeTo = (fromId, toId) => {
    return {
        type: SWIPE_TO,
        payload: {
            timestamp: new Date(), //It should be UTC
            fromId,
            toId
        }
    }
}

const swipeUp = (players) => {
    return {
        type: SWIPE_UP,
        payload: {
            players
        }
    }
}

const addPlayer = ({ uId, status, metadata }) => {
    return {
        type: ADD_PLAYER,
        payload: {
            uId,
            status,
            metadata
        }
    }
}

const removePlayer = (uId, players) => {
    return {
        type: REMOVE_PLAYER,
        payload: {
            uId,
            players
        }
    }
}

const addPlayers = ({ list, status }) => {
    return list.map(uId => addPlayer({
        uId,
        status
    }));
}

const updatePlayerStatus = ({ uid, status }) => {
    return {
        uId,
        status
    };
}

export {
    swipeTo,
    swipeUp,
    addPlayer,
    addPlayers,
    updatePlayerStatus,
    removePlayer
};
