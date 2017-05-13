import { enableBatching } from 'redux-batched-actions';
import { combineReducers } from "redux";

import {
    SWIPE_UP,
    SWIPE_TO,
    ADD_PLAYER,
    REMOVE_PLAYER
} from "./actionTypes.js";


const playerSchema = {
    uId: 0,
    name: "Player 0"
};


const holders = (state = {
    timestamp: new Date(),
    list: [ /* array of uid*/ ]
}, action) => {
    switch (action.type) {
        case ADD_PLAYER:
            if (state.list.length == 0) {
                return {
                    ...state,
                    list: [action.payload.uId]
                }
            }
            return state;
        case SWIPE_UP:
            return {...state,
                list: action.payload.players
            }
        case SWIPE_TO:
            if (state.timestamp < action.payload.timestamp) {
                return {...state,
                    list: [action.payload.toId],
                    timestamp: action.payload.timestamp
                }
            }
            return state;
        default:
            return state;
    }
}


const defaultPlayers = { /*map of player schema*/ };

const players = (state = defaultPlayers, action) => {
    switch (action.type) {
        case ADD_PLAYER:
            {
                let { uId } = action.payload;
                return {...state,
                    [uId]: {...Object.create(playerSchema),
                        uId,
                        name: `Player ${uId}`
                    }
                };
            }
        default:
            return state;
    }
}

const sequence = (state = [ /* array of uIds*/ ], action) => {
    switch (action.type) {
        case ADD_PLAYER:
            return state.concat(action.payload.uId);
        case REMOVE_PLAYER:
            return state.filter(uId => uId != action.payload.uId);
        default:
            return state;
    }
}

export default enableBatching(combineReducers({ players, sequence, holders }));
