import React, { useEffect, useRef, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory, useLocation} from 'react-router-dom';
import classes from './LargeTab.module.scss';
import Auxiliary from '../../hoc/Auxiliary';
import Button from '../../elements/Button/Button';
import Contacts from '../Contacts/Contacts';
import FormInput from '../../elements/FormInput/FormInput';
import {ReactComponent as FileIcon} from '../../assets/file-icon.svg';
import pic from '../../assets/demo-profile-pic.jpg';
import Messages from '../Messages/Messages';
import {userActions} from '../../store/user/user-slice';
import {
    fetchMessages, 
    sendMessage,
    sendFile, 
    acceptContact, 
    refuseContact, 
    fetchRequests, 
    cancelAddContact, 
    contactSearch, 
    createGroupChat,
    addContact } from '../../store/user/user-actions';
import { socket } from '../../App';

const LargeTab = (props) => {
    let tab;

    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    
    const messageInput = useRef();
    const groupNameInput = useRef();
    
    let conv = useSelector(state => state.user.selectedConv);
    let userId = useSelector(state => state.user._id);
    let requests = useSelector(state => state.user.friendRequests);
    let contacts = useSelector(state => state.user.foundContacts);
    let selectedFriends = useSelector(state => state.user.selectedFriends);

    const [convId, setConvId] = useState('');
    const [friendId, setFriendId] = useState('');
    const [selectedFile, setSelectedFile] = useState('');

    useEffect(() => {
        if (props.tabName === 'chat') {
            if ((!conv.messages && conv._id) || conv.new ) {
                history.push(`/main/convs/chat?_id=${conv._id}`)
            }
        }

        if (props.tabName === 'creategroup' && conv._id) {
            history.push(`/main/convs/chat?_id=${conv._id}`);
        }
        
    }, [conv, history, props.tabName])
    
    useEffect(() => {

        if (props.tabName === 'requests') {
            dispatch(fetchRequests());
        }


        if (props.tabName === 'chat') {
            let query = location.search;
            console.log(history.location);
            query = query.replace('?', '').split('=');
            
            let _id = '';
            let friendId = '';
    
            if (query[0] === '_id') {
                _id = query[1];
                dispatch(fetchMessages(_id));
                socket.emit('join', _id);
                setConvId(_id);
            } else if (query[0] === 'friendId') {
                friendId = query[1];
                setFriendId(friendId);
                dispatch(userActions.checkIfConvExist({friendId}));
            }
    
    
            return () => {
                if (_id) {
                    socket.emit('leave', _id);
                }
                dispatch(userActions.leaveConv());
            };
        }

    }, [dispatch, history, location.search, props.tabName]);

    const fileSendChangeHandler = (e) => {
        if (e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    }

    const sendMessageHandler = (e) => {
        e.preventDefault();

        if (friendId) {
            if (selectedFile) {
                let file = new FormData();

                file.append('file', selectedFile);
        
                dispatch(sendFile(file, conv._id, friendId));
            } else {
                dispatch(sendMessage(messageInput.current.value, conv._id, friendId));
            }
        } else {
            let part = conv.participants.find(el => el !== userId);
            if (selectedFile) {
                let file = new FormData();

                file.append('file', selectedFile);
        
                dispatch(sendFile(file, convId, part));            
            } else {
                dispatch(sendMessage(messageInput.current.value, convId, part));
            }
        }
        messageInput.current.value = '';
        setSelectedFile('');
    }

    const acceptContactHandler = (e) => {
        dispatch(acceptContact(e.currentTarget.id));
    }

    const refuseContactHandler = (e) => {
        dispatch(refuseContact(e.currentTarget.id));
    }


    const contactSearchHandler = (e) => {
        dispatch(contactSearch(e.target.value));
    }

    const addContactHandler = (e) => {
        dispatch(addContact(e.currentTarget.id));
    }

    const cancelAddContactHandler = (e) => {
        dispatch(cancelAddContact(e.currentTarget.id));
    }

    const createGroupHandler = () => {
        dispatch(createGroupChat(groupNameInput.current.value, selectedFriends));
    }

    switch (props.tabName) {
        
        case 'chat':
            tab = (
                <Auxiliary>
                    <div className={classes.TabHeader}>
                        <h2>{conv.groupName ? conv.groupName : conv.friendUsername}</h2>
                    </div>
                    <div className={`${classes.TabBody} ${classes.ChatTab}` }>
                        <Messages messages={conv.messages} friendId={conv.participants} userId={userId}/>
                        <form className={classes.ChatForm} onSubmit={sendMessageHandler}>
                            <label className={classes.FileSend}>
                                <FileIcon/>
                                <input type="file" accept='image/*' onChange={fileSendChangeHandler}/>
                            </label>
                            <FormInput 
                                type="text" 
                                inputRef={messageInput}
                                placeholder={selectedFile.name ? selectedFile.name : undefined} 
                                value={selectedFile.name ? '' : undefined}
                                disabled={selectedFile.name ? true : false} />
                            <Button btnType="send-btn" />
                        </form>
                    </div>
                </Auxiliary>
            );
            break;

        case 'addcontact':
            tab = (
                <Auxiliary>
                    <div className={classes.TabHeader}>
                        <h2>Find your friends</h2>
                    </div>
                    <div className={`${classes.TabBody} ${classes.AddContactTab}` }>
                        <FormInput type='search' placeholder='Enter username...' onChange={contactSearchHandler}/>
                        <Contacts 
                        search 
                        friends={contacts} 
                        addContactHandler={addContactHandler} 
                        cancelAddContactHandler={cancelAddContactHandler}/>
                    </div>
                </Auxiliary>
            );
            break;

        case 'requests':
            tab = (
                <Auxiliary>
                    <div className={classes.TabHeader}>
                        <h2>Friend Requests</h2>
                    </div>
                    <div className={`${classes.TabBody} ${classes.RequestsTab}` }>
                        <Contacts friends={requests} requests acceptContactHandler={acceptContactHandler} refuseContactHandler={refuseContactHandler}/>
                    </div>
                </Auxiliary>
            );
            break;

        case 'contact':
            tab = (
                <Auxiliary>
                    <div className={classes.TabHeader}>
                        <h2>John's profile</h2>
                        <Button to='/main/friends' btnType='back-btn'/>
                    </div>
                    <div className={`${classes.TabBody} ${classes.ContactTab}` }>
                        <img src={pic} alt="" />
                        <h1>John Doe</h1>
                        <Button btnType='primary'>Send a message</Button>
                        <Button btnType='secondary'>Remove from friends list</Button>
                    </div>
                </Auxiliary>
            );
            break;

        case 'creategroup':
            tab = (
                <Auxiliary>
                    <div className={classes.TabHeader}>
                        <h2>Create a group chat</h2>
                    </div>
                    <div className={`${classes.TabBody} ${classes.GroupTab}` }>
                        <FormInput type='search' placeholder='Enter group name...' inputRef={groupNameInput}/>
                        <Button btnType='primary-form' click={createGroupHandler}>Confirm</Button>
                        <Button btnType='secondary' to='/main/friends/group'>Cancel</Button>
                    </div>
                </Auxiliary>
            );
            break;

        case 'profile':
            tab = (
                <Auxiliary>
                    <div className={classes.TabHeader}>
                        <h2>My profile</h2>
                    </div>
                    <div className={`${classes.TabBody} ${classes.ProfileTab}` }>
                        <div className={classes.ProfilePic}>
                            <img src={pic} alt="" />
                            <h1>John Doe</h1>
                            <Button btnType='secondary'>Change profile picture</Button>
                        </div>
                        <form className={classes.ProfileForm}>
                            <h3>Profile Infos:</h3>
                            <div>
                                <label>Online status:</label>
                                <FormInput select>
                                    <option value="online">Online</option>
                                    <option value="busy">Busy</option>
                                    <option value="offline">Offline</option>
                                </FormInput>
                            </div>
                            <div>
                                <label>First name:</label>
                                <FormInput type="text" />
                            </div>
                            <div>
                                <label>Last name:</label>
                                <FormInput type="text" />
                            </div>
                            <h3>Account Infos:</h3>
                            <div>
                                <label>Old Password:</label>
                                <FormInput type="password" />
                            </div>
                            <div>
                                <label>New Password:</label>
                                <FormInput type="password" />
                            </div>
                            <Button btnType='primary-form'>Confirm</Button>
                            <Button to='/main/profile' btnType='secondary-form'>Cancel</Button>
                        </form>
                    </div>
                </Auxiliary>
            );
            break;

    
        default:
            break;
    }
    return (
        <div className={classes.LargeTab}>
            {tab}
        </div>
    )
}

export default LargeTab
