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
    addContact,
    updateProfile,
    uploadPicture, 
    fetchConvs} from '../../store/user/user-actions';
import { socket } from '../../App';

const LargeTab = (props) => {
    let tab;

    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    
    const messageInput = useRef();
    const groupNameInput = useRef();
    const usernameInput = useRef();
    const firstNameInput = useRef();
    const lastNameInput = useRef();
    const oldPasswordInput = useRef();
    const newPasswordInput = useRef();
    const statusSelect = useRef();
    
    let conv = useSelector(state => state.user.selectedConv);
    let userId = useSelector(state => state.user._id);
    let requests = useSelector(state => state.user.friendRequests);
    let contacts = useSelector(state => state.user.foundContacts);
    let selectedFriends = useSelector(state => state.user.selectedFriends);
    let user = useSelector(state => state.user);
    let baseUrl = useSelector(state => state.user.baseUrl);

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
            // dispatch(fetchConvs());
            let query = location.search;
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

    const pictureChangeHandler = (e) => {
        e.preventDefault();

        let pictureToUpload = new FormData();

        pictureToUpload.append('picture', e.target.files[0]);

        dispatch(uploadPicture(pictureToUpload));
    }

    const profileUpdateHandler = (e) => {
        e.preventDefault();

        let username = usernameInput.current.value;
        let firstName = firstNameInput.current.value;
        let lastName = lastNameInput.current.value;
        let oldPassword = oldPasswordInput.current.value;
        let newPassword = newPasswordInput.current.value;
        let status = statusSelect.current.value;

        dispatch(updateProfile(firstName, lastName, username, status, oldPassword, newPassword));

        usernameInput.current.value = '';
        firstNameInput.current.value = '';
        lastNameInput.current.value = '';
        oldPasswordInput.current.value = '';
        newPasswordInput.current.value = '';
    }

    switch (props.tabName) {
        
        case 'chat':
            tab = (
                <Auxiliary>
                    <div className={classes.TabHeader}>
                        <h2>{conv.groupName ? conv.groupName : conv.friendUsername}</h2>
                    </div>
                    <div className={`${classes.TabBody} ${classes.ChatTab}` }>
                        <Messages baseUrl={baseUrl} messages={conv.messages} friendId={conv.participants} userId={userId}/>
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
                        cancelAddContactHandler={cancelAddContactHandler}
                        baseUrl={baseUrl}/>
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
                        <Contacts baseUrl={baseUrl} friends={requests} requests acceptContactHandler={acceptContactHandler} refuseContactHandler={refuseContactHandler}/>
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
                        <img src={`${baseUrl}/users/${user._id}/picture?${Date.now()}`} alt="Profile pic" loading='lazy' />
                            <h1>{user.username}</h1>
                            <label className={classes.PictureUpload}>
                                <input type="file" accept='image/*' onChange={pictureChangeHandler}/>
                                Change profile picture
                                <FileIcon/>
                            </label>                        </div>
                        <form className={classes.ProfileForm}>
                            <div>
                                <h3> - Update profile Infos:</h3>
                                <div>
                                    <label>Online status:</label>
                                    <FormInput select inputRef={statusSelect}>
                                        <option value="Online" selected={user.status==='Online' ? true : false}>Online</option>
                                        <option value="Busy" selected={user.status==='Busy' ? true : false}>Busy</option>
                                        <option value="Offline" selected={user.status==='Offline' ? true : false}>Offline</option>
                                    </FormInput>
                                </div>
                                <div>
                                    <label>Username:</label>
                                    <FormInput type="text" placeholder={user.username}  inputRef={usernameInput}/>
                                </div>
                                <div>
                                    <label>First name:</label>
                                    <FormInput type="text" placeholder={user.firstName}  inputRef={firstNameInput}/>
                                </div>
                                <div>
                                    <label>Last name:</label>
                                    <FormInput type="text" placeholder={user.lastName} inputRef={lastNameInput}/>
                                </div>
                            </div>
                            <div>
                                <h3> - Change account password:</h3>
                                <div>
                                    <label>Old Password:</label>
                                    <FormInput type="password"  inputRef={oldPasswordInput}/>
                                </div>
                                <div>
                                    <label>New Password:</label>
                                    <FormInput type="password"  inputRef={newPasswordInput}/>
                                </div>
                            </div>
                            <div>
                                <Button btnType='primary-form' click={profileUpdateHandler} >Confirm</Button>
                                <Button to='/main/convs' btnType='secondary-form'>Cancel</Button>
                            </div>
                        </form>
                    </div>
                </Auxiliary>
            );
            break;

        case 'settings':
        tab = (
            <Auxiliary>
                <div className={classes.TabHeader}>
                    <h2>Create a group chat</h2>
                </div>
                <div className={`${classes.TabBody} ${classes.SettingsTab}` }>
                    <div>
                        <h3>Dark/Light Mode</h3>
                        <Button btnType='primary-form' click={props.switchDarkLightMode}>Toggle</Button>
                    </div>
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
