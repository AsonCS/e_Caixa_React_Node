import { CLIENT_LIST, FIND_CLIENT, TO_WITHDRAW_CLIENT, DEPOSIT_CLIENT, DROP_CLIENT, NEW_CLIENT } from '../actions/types';

const initialState = {
    allClients : [],
    conta : {},
    result : {},
    error : {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case CLIENT_LIST:
            return {
                ...state,
                allClients : action.clientsList
            }
        case NEW_CLIENT:
            return {
                state,
                conta : action.conta,
                error : action.error
            }
        case FIND_CLIENT:
            return {
                state,
                conta : action.conta,
                error : action.error
            }
        case DROP_CLIENT:
            return {
                state,
                conta : action.conta,
                result : action.result,
                error : action.error
            }
        case TO_WITHDRAW_CLIENT:
            return {
                state,
                conta : action.conta,
                error : action.error
            }
        case DEPOSIT_CLIENT:
            return {
                state,
                conta : action.conta,
                error : action.error
            }
        default:
            return state;
    }
};
