import {
    SWIPE_TO,
    SWIPE_UP,
    ADD_PLAYER,
    REMOVE_PLAYER,
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

const addPlayer = (uId) => {
    return {
        type: ADD_PLAYER,
        payload: {
            uId
        }
    }
}

const addPlayers = (uIdList) => {
    return uIdList.map(uId=>addPlayer(uId));
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


export { swipeTo, swipeUp, addPlayer, addPlayers, removePlayer };
