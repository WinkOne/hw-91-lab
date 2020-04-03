export const wsSuccess = (data) => ({type: data.type, data});

export const ws = (message) => {
    return dispatch => {
        try {
            const data = JSON.parse(message);
            dispatch(wsSuccess(data))

        } catch (e) {
            console.log(e)
        }

    };
};


