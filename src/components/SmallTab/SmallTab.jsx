import React from 'react'
import classes from './SmallTab.module.scss';
import Auxiliary from '../../hoc/Auxiliary';
import Button from '../../elements/Button/Button';
import Convs from '../Convs/Convs';
import Contacts from '../Contacts/Contacts';
import FormInput from '../../elements/FormInput/FormInput';

const SmallTab = (props) => {
    let tab;

    switch (props.tabName) {
        case 'convs':
            tab = (
                <Auxiliary>
                    <div className={classes.TabHeader}>
                        <h2>Conversations</h2>
                        <Button to='/main/convs/add' btnType='add-conv'/>
                    </div>
                    <div className={`${classes.TabBody} ${classes.ConvsTab}` }>
                        <Convs/>
                    </div>
                </Auxiliary>
            );
            break;

        case 'addconv':
            tab = (
                <Auxiliary>
                    <div className={classes.TabHeader}>
                        <h2>Start a new conversation</h2>
                        <Button to='/main/convs' btnType='back-btn'/>
                    </div>
                    <div className={`${classes.TabBody} ${classes.ConvsTab}` }>
                        <Contacts/>
                    </div>
                </Auxiliary>
            );
            break;

        case 'friends':
            tab = (
                <Auxiliary>
                    <div className={classes.TabHeader}>
                        <h2>Friends</h2>
                        <Button to='/main/friends/group' btnType='group'/>
                        <Button to='/main/friends/search' btnType='add-contact'/>
                    </div>
                    <div className={`${classes.TabBody} ${classes.FriendsTab}` }>
                        <Contacts/>
                    </div>
                </Auxiliary>
            );
            break;

        case 'addcontact':
            tab = (
                <Auxiliary>
                    <div className={classes.TabHeader}>
                        <h2>Find your friends</h2>
                        <Button to='/main/friends' btnType='back-btn'/>
                    </div>
                    <div className={`${classes.TabBody} ${classes.AddContactTab}` }>
                        <FormInput type='search' placeholder='Enter username...'/>
                        <Contacts search/>
                    </div>
                </Auxiliary>
            );
            break;

        case 'addtogroup':
            tab = (
                <Auxiliary>
                    <div className={classes.TabHeader}>
                        <h2>Select friends</h2>
                        <Button to='/main/friends' btnType='back-btn'/>
                    </div>
                    <div className={`${classes.TabBody} ${classes.GroupTab}` }>
                        <FormInput type='search' placeholder='Enter username...'/>
                        <Contacts group/>
                        <Button btnType='primary' to='/main/friends/group/confirm'>Confirm</Button>
                    </div>
                </Auxiliary>
            );
            break;

        default:
            break;
    }
    return (
        <div className={classes.SmallTab}>
            {tab}
        </div>
    )
}

export default SmallTab
