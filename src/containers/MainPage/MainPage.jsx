import React, { useState, useEffect } from 'react';
import {Switch, Route, useHistory} from 'react-router-dom';
import classes from './MainPage.module.scss';
import NavBar from '../../components/NavBar/NavBar';
import LargeTab from '../../components/LargeTab/LargeTab';
import SmallTab from '../../components/SmallTab/SmallTab';
import Notif from '../../components/Notif/Notif';
import {socket} from '../../App';
import { userActions } from '../../store/user/user-slice';
import { useDispatch } from 'react-redux';

const MainPage = (props) => {

    const history = useHistory();

    const dispatch = useDispatch();

	const [notifShow, setNotifShow] = useState(false);
	const [notifMessage, setNotifMessage] = useState('');
	const [notifLink, setNotifLink] = useState('');

    useEffect(() => {

        const clearNotif = () => {
            setTimeout(() => {
                if (history.location.pathname !== '/main/convs/chat') {
                    setNotifShow(false);
                    setNotifMessage('');
                    setNotifLink('');
                }
            }, 3000);
        };

		socket.on("notify:message", (payload) => {
            if (history.location.pathname !== '/main/convs/chat') {
                setNotifShow(true);
                setNotifMessage(`New message from ${payload.username}`)
                setNotifLink('/');
                clearNotif();
            }
            dispatch(userActions.updateConvWithLastMessage(payload))
		});

        socket.on('notify:request', (sender) => {
            if (history.location.pathname !== '/main/convs/chat') {
                setNotifShow(true);
                setNotifMessage(`${sender.username} sent you a friend request`);
                setNotifLink('/main/friends/requests');
                clearNotif();
            }
        });

        socket.on('notify:accepted', (sender) => {
            if (history.location.pathname !== '/main/convs/chat') {
                setNotifShow(true);
                setNotifMessage(`${sender.username} accepted your friend request`);
                setNotifLink('/main/friends');
                clearNotif();
            }
        });

    }, [dispatch, history.location.pathname])

    return (
        <div className={`${classes.MainPage} ${props.isDarkMode ? '' : classes.LightMode}`}>
            <NavBar isDarkMode={props.isDarkMode} logoutHandler={props.logoutHandler}/>
            <Notif notifShow={notifShow} notifLink={notifLink}>{notifMessage}</Notif>
            
            <Switch>
                <Route exact path='/main/convs'>
                    <SmallTab tabName='convs'/>
                </Route>

                <Route exact path='/main/convs/add'>
                    <SmallTab tabName='addconv'/>
                </Route>

                <Route exact path='/main/friends'>
                    <SmallTab 
                    tabName='friends' 
                    tabMenuShow={props.tabMenuShow} 
                    tabMenuToggleHandler={props.tabMenuToggleHandler}
                    bdShow={props.bdShow} />
                </Route>

                <Route exact path='/main/friends/search'>
                    <SmallTab 
                        tabName='friends' 
                        tabMenuShow={props.tabMenuShow} 
                        tabMenuToggleHandler={props.tabMenuToggleHandler}
                        bdShow={props.bdShow} />
                    <LargeTab tabName='addcontact'/>
                </Route>

                <Route exact path='/main/friends/requests'>
                    <SmallTab 
                    tabName='friends' 
                    tabMenuShow={props.tabMenuShow} 
                    tabMenuToggleHandler={props.tabMenuToggleHandler}
                    bdShow={props.bdShow} />
                    <LargeTab tabName='requests'/>
                </Route>

                <Route exact path='/main/friends/group'>
                    <SmallTab tabName='addtogroup'/>
                </Route>

                <Route exact path='/main/friends/group/confirm'>
                    <SmallTab tabName='addtogroup'/>
                    <LargeTab tabName='creategroup'/>
                </Route>

                <Route exact path='/main/profile'>
                    <div className={classes.Hidden}></div>
                    <LargeTab tabName='profile'/>
                </Route>

                <Route exact path='/main/convs/chat'>
                    <SmallTab tabName='convs'/>
                    <LargeTab tabName='chat'/>
                </Route>

                <Route exact path='/main/settings'>
                    <div className={classes.Hidden}></div>
                    <LargeTab tabName='settings' switchDarkLightMode={props.switchDarkLightMode}/>
                </Route>
            </Switch>
        </div>
    )
}

export default MainPage
