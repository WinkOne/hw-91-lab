const initialState = {
    userOnline: [],
    messages: []
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'NEW_USER':
            return {...state, userOnline: [...action.data.userName]};
        case 'DISCONNECTED_USER':
            return {...state, userOnline: [...action.data.userName]};
        case 'NEW_MESSAGE':
            return {...state, messages: [...state.messages, action.data.message]};
        case 'LAST_MESSAGES':
            return {...state, messages: action.data.messages};

        default:
            return state;
    }

};

export default chatReducer;