import {userActions} from './user-slice';
import axios from '../../axios';

export const fetchConvs = () => {
    return async (dispatch) => {
        try {
            dispatch(userActions.setIsLoading());

            let res = await axios.get('/convs', {headers: {Authorization: localStorage.getItem('token')}});

            if (res.status === 200) {
                dispatch(userActions.fetchConvsSuccess({
                    convs: res.data
                }));
            }


        } catch (e) {
            dispatch(userActions.setLoadingDone());
        }
    }
}

export const fetchFriends = () => {
    return async (dispatch) => {
        try {
            dispatch(userActions.setIsLoading());

            let res = await axios.get('/users/friends', {headers: {Authorization: localStorage.getItem('token')}});

            if (res.status === 200) {
                dispatch(userActions.fetchFriendsSuccess({
                    friends: res.data
                }));
            }


        } catch (e) {
            dispatch(userActions.setLoadingDone());
        }
    }
}

export const fetchRequests = () => {
    return async (dispatch) => {
        try {
            dispatch(userActions.setIsLoading());

            let res = await axios.get('/users/requests', {headers: {Authorization: localStorage.getItem('token')}});

            if (res.status === 200) {
                dispatch(userActions.fetchRequestsSuccess({
                    requests: res.data
                }));
            }


        } catch (e) {
            dispatch(userActions.setLoadingDone());
            dispatch(userActions.fetchRequestsError({
                requests: []
            }));
        }
    }
}

export const contactSearch = (username) => {
    return async (dispatch) => {
        try {
            dispatch(userActions.setIsLoading());
            if (username) {
                let res = await axios.get('/users', {params: {username}, headers: {Authorization: localStorage.getItem('token')}});
    
                if (res.status === 200) {
                    dispatch(userActions.contactSearchSuccess({
                        contacts: res.data
                    }));
                } else {
                    dispatch(userActions.contactSearchError());
                }
    
            } else {
                dispatch(userActions.contactSearchError());
            }
        } catch (e) {
            dispatch(userActions.contactSearchError());
        }
    }
}

export const addContact = (_id) => {
    return async (dispatch) => {
        try {
            dispatch(userActions.setIsLoading());
            let res = await axios.post('/users/add', {_id}, {headers: {Authorization: localStorage.getItem('token')}});

            if (res.status === 200) {
                dispatch(userActions.contactAddSuccess({
                    contact: res.data
                }));
            }


        } catch (e) {
            dispatch(userActions.setError({error: e.response.data.toString()}));
        }
    }
}

export const cancelAddContact = (_id) => {
    return async (dispatch) => {
        try {
            dispatch(userActions.setIsLoading());
            let res = await axios.delete('/users/requests', {params: {_id, sent: true}, headers: {Authorization: localStorage.getItem('token')}});

            if (res.status === 200) {
                dispatch(userActions.contactCancelAddSuccess({
                    contact: res.data
                }));
            }


        } catch (e) {
            dispatch(userActions.setError({error: e.response.data.toString()}));
        }
    }
}

export const acceptContact = (_id) => {
    return async (dispatch) => {
        try {
            dispatch(userActions.setIsLoading());
            let res = await axios.post('/users/accept', {_id}, {headers: {Authorization: localStorage.getItem('token')}});

            if (res.status === 200) {
                dispatch(userActions.contactAcceptSuccess({_id}));
            }


        } catch (e) {
            dispatch(userActions.setError({error: e.response.data.toString()}));
        }
    }
}

export const refuseContact = (_id) => {
    return async (dispatch) => {
        try {
            dispatch(userActions.setIsLoading());
            let res = await axios.delete('/users/requests', {params: {_id}, headers: {Authorization: localStorage.getItem('token')}});

            if (res.status === 200) {
                dispatch(userActions.contactRefuseSuccess({_id}));
            }


        } catch (e) {
            dispatch(userActions.setError({error: e.response.data.toString()}));
        }
    }
}

export const fetchMessages = (_id, friendId) => {
    return async (dispatch) => {
        try {
            dispatch(userActions.setIsLoading());
            let res = await axios.get('/convs', {params: {_id, friendId}, headers: {Authorization: localStorage.getItem('token')}});

            if (res.status === 200) {
                dispatch(userActions.fetchMessagesSuccess({
                    conv: res.data
                }));
            }


        } catch (e) {
            dispatch(userActions.setLoadingDone());
        }
    }
}

export const sendMessage = (message, _id, friendId) => {
    return async (dispatch) => {
        try {
            dispatch(userActions.setIsLoading());
            let res = await axios.post('/convs/message', {message, _id, friendId}, {headers: {Authorization: localStorage.getItem('token')}});

            if (res.status === 201) {
                dispatch(userActions.sendMessageSuccess({
                    message,
                    conv: res.data
                }));
            }


        } catch (e) {
            dispatch(userActions.setError({error: e.response.data.toString()}));
        }
    }
}

export const sendFile = (file, _id, friendId) => {
    return async (dispatch) => {
        try {
            dispatch(userActions.setIsLoading());
            let res = await axios.post('/convs/file', file, {params: {_id, friendId}, headers: {Authorization: localStorage.getItem('token')}});
            
            if (res.status === 201) {
                dispatch(userActions.sendFileSuccess({
                    file: true,
                    conv: res.data.conv ? res.data.conv : '',
                    lastMessageId: res.data.lastMessageId
                }));
            } else {
            }


        } catch (e) {
            dispatch(userActions.setError({error: e.response.data.toString()}));
        }
    }
}

export const uploadPicture = (picture) => {
    return async (dispatch) => {
        try {
            dispatch(userActions.setIsLoading());
            let res = await axios.post('/users/picture', picture, {headers: {Authorization: localStorage.getItem('token')}});

            if (res.status === 201) {
                dispatch(userActions.uploadPictureSuccess());
            }


        } catch (e) {
            dispatch(userActions.setError({error: e.response.data.toString()}));
        }
    }
}


export const createGroupChat = (groupName, participants) => {
    return async (dispatch) => {
        try {
            dispatch(userActions.setIsLoading());
            let res = await axios.post('/convs/group', {groupName, participants} , {headers: {Authorization: localStorage.getItem('token')}});

            if (res.status === 201) {
                dispatch(userActions.createGroupChatSuccess({
                    conv: res.data
                }));
            }


        } catch (e) {
            dispatch(userActions.setError({error: e.response.data.toString()}));
        }
    }
}

export const updateProfile = (firstName, lastName, username, status, oldPassword, newPassword) => {
    return async (dispatch) => {
        try {
            dispatch(userActions.setIsLoading());
            let res = await axios.post('/users/update', {firstName, lastName, username, status, oldPassword, newPassword} , {headers: {Authorization: localStorage.getItem('token')}});

            if (res.status === 201) {
                dispatch(userActions.updateProfileSuccess({
                    userInfos: res.data
                }));
            }


        } catch (e) {
            dispatch(userActions.setError({error: e.response.data.toString()}));
        }
    }
}