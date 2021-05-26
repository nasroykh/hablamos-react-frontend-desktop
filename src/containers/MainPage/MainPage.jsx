import React, { useState } from 'react';
import classes from './MainPage.module.scss';
import NavBar from '../../components/NavBar/NavBar';
import LargeTab from '../../components/LargeTab/LargeTab';
import SmallTab from '../../components/SmallTab/SmallTab';
import {Switch, Route} from 'react-router-dom';
import SideDrawer from '../../components/SideDrawer/SideDrawer';
import BackDrop from '../../elements/BackDrop/BackDrop';

const MainPage = () => {

    return (
        <div className={classes.MainPage}>
            <NavBar />
            
            <Switch>
                <Route exact path='/main/convs'>
                    <SmallTab tabName='convs'/>
                </Route>

                <Route exact path='/main/convs/add'>
                    <SmallTab tabName='addconv'/>
                </Route>

                <Route exact path='/main/friends'>
                    <SmallTab tabName='friends'/>
                </Route>

                <Route exact path='/main/friends/search'>
                    <SmallTab tabName='addcontact'/>
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

                <Route exact path='/main/chat/:id'>
                    <SmallTab tabName='convs'/>
                    <LargeTab tabName='chat'/>
                </Route>
            </Switch>
        </div>
    )
}

export default MainPage
