import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    _id: '',
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    friends: [],
    friendRequests: [],
    status: '',
    convs: [],
    selectedConv: {},
    foundContacts: [],
    socketId: '',
    dialogText: '',
    isLoading: false,
    pictureUploaded: false,
    selectedFriends: [],
    groupName: ''
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess(state, action) {
            state.isLoading = false;
            for (const key in action.payload.userInfos) {
                state[key] = action.payload.userInfos[key];
            }
        },
        logoutSuccess(state) {
            for (const key in state) {
                state[key] = initialState[key];
            }
        },
        setError(state, action) {
            state.isLoading = false;
            state.dialogText = action.payload.error;
        },
        fetchConvsSuccess(state, action) {
            state.isLoading = false;
            
            for (let i = 0; i < action.payload.convs.length; i++) {
                action.payload.convs[i].participants = action.payload.convs[i].participants.filter(el => el._id !== state._id);
                
                action.payload.convs[i].lastMessage = action.payload.convs[i].messages;

                action.payload.convs[i].messages = undefined;
            }

            action.payload.convs.sort((a, b) => {
                if (a.lastMessage[0].sentAt > b.lastMessage[0].sentAt) {
                    return -1;
                }

                if (a.lastMessage[0].sentAt < b.lastMessage[0].sentAt) {
                    return 1;
                }

                return 0;
            });

            state.convs = action.payload.convs;
            state.pictureUploaded = false;
        },
        fetchFriendsSuccess(state, action) {
            state.isLoading = false;
            state.friends = action.payload.friends;
            state.pictureUploaded = false;
        },
        fetchRequestsSuccess(state, action) {
            state.isLoading = false;
            state.friendRequests = action.payload.requests;
        },
        fetchRequestsError(state, action) {
            state.isLoading = false;
            state.friendRequests = [];
        },
        contactSearchSuccess(state, action) {
            state.isLoading = false;
            state.foundContacts = action.payload.contacts;
        },
        contactSearchError(state, action) {
            state.isLoading = false;
            state.foundContacts = [];
        },
        contactAddSuccess(state, action) {
            state.isLoading = false;
            for (let i = 0; i < state.foundContacts.length; i++) {
                if (state.foundContacts[i]._id === action.payload.contact._id) {
                    state.foundContacts[i].sent = true
                } 
            }
        },
        contactCancelAddSuccess(state, action) {
            state.isLoading = false;
            for (let i = 0; i < state.foundContacts.length; i++) {
                if (state.foundContacts[i]._id === action.payload.contact._id) {
                    state.foundContacts[i].sent = false
                } 
                
            }
        },
        contactAcceptSuccess(state, action) {
            state.isLoading = false;
            state.friendRequests = state.friendRequests.filter(el => el._id !== action.payload._id)
        },
        contactRefuseSuccess(state, action) {
            state.isLoading = false;
            state.friendRequests = state.friendRequests.filter(el => el._id !== action.payload._id)
        },
        fetchMessagesSuccess(state, action) {
            state.isLoading = false;
            state.selectedConv = action.payload.conv;
            if (state.selectedConv.participants.length === 2) {
                let friend = state.selectedConv.participants.find(el => el !== state._id);
                state.selectedConv.friendUsername = state.friends.find(el => el._id === friend).username;
                state.selectedConv.participants = state.selectedConv.participants.filter(el => el !== state._id);
            }

            for (let i = 0; i < state.convs.length; i++) {
                if (state.convs[i]._id === action.payload.conv._id) {
                    if (state.convs[i].lastMessage[0].sender !== state._id) {
                        state.convs[i].lastMessage[0].seenBy.push(state._id);
                    }
                }
            }
        },
        sendMessageSuccess(state, action) {
            state.isLoading = false;
            if (action.payload.conv._id) {
                state.selectedConv = action.payload.conv;
                state.selectedConv.new = true;
            } else {
                state.selectedConv.messages.push({message: action.payload.message, _id: Date.now(), sender: state._id, sentAt: Date.now()});
                
                for (let i = 0; i < state.convs.length; i++) {
                    if(state.convs[i]._id === state.selectedConv._id) {
                        state.convs[i].lastMessage = [{
                            message: action.payload.message, 
                            _id: Date.now(), 
                            sender: state._id, 
                            sentAt: Date.now(),
                            seenBy: []
                        }]
                    }
                }
            }
        },
        sendFileSuccess(state, action) {
            state.isLoading = false;
            if (action.payload.conv._id) {
                state.selectedConv = action.payload.conv;
                state.selectedConv.new = true;
            } else {
                state.selectedConv.messages.push({file: action.payload.file, _id: action.payload.lastMessageId, sender: state._id, sentAt: Date.now()});
            
                for (let i = 0; i < state.convs.length; i++) {
                    if(state.convs[i]._id === state.selectedConv._id) {
                        state.convs[i].lastMessage = [{
                            file: action.payload.file, 
                            _id: action.payload.lastMessageId, 
                            sender: state._id, 
                            sentAt: Date.now(),
                            seenBy: []
                        }]
                    }
                }
            }

        },
        receiveMessage(state, action) {
            if (action.payload.sender !== state._id) {
                state.selectedConv.messages.push({message: action.payload.message, _id: action.payload.lastMessageId, sender: action.payload.sender, sentAt: action.payload.time})
            
                for (let i = 0; i < state.convs.length; i++) {
                    if(state.convs[i]._id === state.selectedConv._id) {
                        state.convs[i].lastMessage = [{
                            message: action.payload.message, 
                            _id: action.payload.lastMessageId, 
                            sender: action.payload.sender, 
                            sentAt: action.payload.time,
                            seenBy: [state._id]
                        }]
                    }
                }
            }

        },
        receiveFile(state, action) {
            if (action.payload.sender !== state._id) {
                state.selectedConv.messages.push({file: action.payload.file, _id: action.payload._id, sender: action.payload.sender, sentAt: action.payload.time})
            
                for (let i = 0; i < state.convs.length; i++) {
                    if(state.convs[i]._id === state.selectedConv._id) {
                        state.convs[i].lastMessage = [{
                            file: action.payload.file, 
                            _id: action.payload._id, 
                            sender: action.payload.sender, 
                            sentAt: action.payload.time,
                            seenBy: [state._id]
                        }]
                    }
                }
            }
        },
        leaveConv(state) {
            state.selectedConv = {};
        },
        checkIfConvExist(state, action) {
            for (let i = 0; i < state.convs.length; i++) {
                if (state.convs[i].participants.length === 1) {
                    if (state.convs[i].participants[0]._id === action.payload.friendId) {
                        state.selectedConv = state.convs[i];
                    }
                }
            }
        },
        closeDialogBox(state) {
            state.dialogText = '';
        },
        setIsLoading(state) {
            state.isLoading = true;
        },
        setLoadingDone(state) {
            state.isLoading = false;
        },
        uploadPictureSuccess(state) {
            state.isLoading = false;
            state.pictureUploaded = true;
        },
        addToGroup(state, action) {
            if (state.selectedFriends.includes(action.payload._id)) {
                state.selectedFriends = state.selectedFriends.filter(el => el !== action.payload._id);
            } else {
                state.selectedFriends.push(action.payload._id);
            }
        },
        createGroupChatSuccess(state, action) {
            state.isLoading = false;
            state.selectedConv = action.payload.conv;
        },
        updateProfileSuccess(state, action) {
            state.isLoading = false;
            for (const key in action.payload.userInfos) {
                state[key] = action.payload.userInfos[key];
            }
        },
        messageSeen(state, action) {
            if (state.selectedConv.messages[state.selectedConv.messages.length-1].seenBy) {
                state.selectedConv.messages[state.selectedConv.messages.length-1].seenBy.push(action.payload._id);
            } else {
                state.selectedConv.messages[state.selectedConv.messages.length-1].seenBy = [action.payload._id];
            }
        },
        updateConvWithLastMessage(state, action) {
            let convFound = false;

            for (let i = 0; i < state.convs.length; i++) {
                if (state.convs[i]._id === action.payload.convId.toString()) {
                    state.convs[i].lastMessage[0] = {
                        seenBy: [],
                        _id: Date.now(),
                        sender: action.payload._id,
                        sentAt: action.payload.sentAt,
                        message: action.payload.message ? action.payload.message : undefined,
                        file: action.payload.file ? action.payload.file : undefined
                    }

                    convFound = true;
                } 
            }

            if (!convFound) {
                state.convs.push({
                    _id: action.payload.convId,
                    participants: [
                        {
                            _id: action.payload._id,
                            username: action.payload.username
                        }
                    ],
                    lastMessage: [{
                        seenBy: [],
                        _id: Date.now(),
                        sender: action.payload._id,
                        sentAt: action.payload.sentAt,
                        message: action.payload.message ? action.payload.message : undefined,
                        file: action.payload.file ? action.payload.file : undefined
                    }]
                });
            }

            state.convs.sort((a, b) => {
                if (a.lastMessage[0].sentAt > b.lastMessage[0].sentAt) {
                    return -1;
                }

                if (a.lastMessage[0].sentAt < b.lastMessage[0].sentAt) {
                    return 1;
                }

                return 0;
            });
        }
    }
});

export const userActions = userSlice.actions;
export default userSlice;