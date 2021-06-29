import classes from './SmallTab.module.scss';
import React, { useEffect } from 'react'
import {useSelector, useDispatch} from 'react-redux';
import Auxiliary from '../../hoc/Auxiliary';
import Button from '../../elements/Button/Button';
import Convs from '../Convs/Convs';
import Contacts from '../Contacts/Contacts';
import { 
    fetchConvs, 
    fetchFriends, 
    fetchRequests } from '../../store/user/user-actions';
import { userActions } from '../../store/user/user-slice';
import TabMenu from '../TabMenu/TabMenu';
import BackDrop from '../../elements/BackDrop/BackDrop';

const SmallTab = (props) => {
    let tab;

    const dispatch = useDispatch();

    useEffect(() => {
        switch (props.tabName) {
            case 'convs':
                dispatch(fetchConvs());
                break;
        
            case 'friends':
            case 'addconv':
            case 'addtogroup':
                dispatch(fetchFriends());
                break;
            case 'requests':
                dispatch(fetchRequests());
                break;

            default:
                break;
        }
    }, [dispatch, props.tabName]);

    let convs = useSelector(state => state.user.convs);
    let friends = useSelector(state => state.user.friends);
    let baseUrl = useSelector(state => state.user.baseUrl);

    const addToGroupHandler = (e) => {
        e.preventDefault();

        dispatch(userActions.addToGroup({_id: e.target.id}));
    }


    switch (props.tabName) {
        case 'convs':
            tab = (
                <Auxiliary>
                    <div className={classes.TabHeader}>
                        <h2>Conversations</h2>
                        <Button to='/main/convs/add' btnType='add-conv'/>
                    </div>
                    <div className={`${classes.TabBody} ${classes.ConvsTab}` }>
                        <Convs baseUrl={baseUrl} convs={convs}/>
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
                        <Contacts baseUrl={baseUrl} friends={friends} addConv/>
                    </div>
                </Auxiliary>
            );
            break;

        case 'friends':
            tab = (
                <Auxiliary>
                    <div className={classes.TabHeader}>
                        <h2>Friends</h2>
                        {/* <Button to='/main/friends/group' btnType='group'/>
                        <Button to='/main/friends/search' btnType='add-contact'/> */}
                        <Button btnType='tab-menu' click={props.tabMenuToggleHandler}/>
                        <TabMenu friends tabMenuShow={props.tabMenuShow} tabMenuToggleHandler={props.tabMenuToggleHandler}/>
                    </div>
                    <div className={`${classes.TabBody} ${classes.FriendsTab}` }>
                        <BackDrop click={props.tabMenuToggleHandler} bdShow={props.bdShow}/>
                        <Contacts baseUrl={baseUrl} friends={friends}/>
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
                        <Contacts baseUrl={baseUrl} group friends={friends} addToGroupHandler={addToGroupHandler}/>
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
