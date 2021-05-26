import React from 'react'
import classes from './LargeTab.module.scss';
import Auxiliary from '../../hoc/Auxiliary';
import Button from '../../elements/Button/Button';
import Convs from '../Convs/Convs';
import Contacts from '../Contacts/Contacts';
import FormInput from '../../elements/FormInput/FormInput';
import pic from '../../assets/demo-profile-pic.png';
import Messages from '../Messages/Messages';

const LargeTab = (props) => {
    let tab;

    switch (props.tabName) {

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
                        <FormInput type='search' placeholder='Enter group name...'/>
                        <Button btnType='primary'>Confirm</Button>
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

        case 'chat':
            tab = (
                <Auxiliary>
                    <div className={classes.TabHeader}>
                        <h2>John Doe</h2>
                    </div>
                    <div className={`${classes.TabBody} ${classes.ChatTab}` }>
                        <Messages/>
                        <form className={classes.ChatForm}>
                            <Button btnType='file-send'/>
                            <FormInput type="text" />
                            <Button btnType="send-btn" />
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
