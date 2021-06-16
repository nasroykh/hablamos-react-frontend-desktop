import React, { useState, useEffect } from 'react';
import classes from './MainPage.module.scss';
import NavBar from '../../components/NavBar/NavBar';
import LargeTab from '../../components/LargeTab/LargeTab';
import SmallTab from '../../components/SmallTab/SmallTab';
import Notif from '../../components/Notif/Notif';
import {Switch, Route, useHistory} from 'react-router-dom';
import {socket} from '../../App';

const MainPage = (props) => {

    const history = useHistory();

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

		socket.on("notify:message", (sender) => {
            if (history.location.pathname !== '/main/convs/chat') {
                setNotifShow(true);
                setNotifMessage(`New message from ${sender.username}`)
                setNotifLink('/');
                clearNotif();
            }
            
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

    }, [history.location.pathname])

    return (
        <div className={classes.MainPage}>
            <NavBar logoutHandler={props.logoutHandler}/>
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
            </Switch>
        </div>
    )
}

export default MainPage
