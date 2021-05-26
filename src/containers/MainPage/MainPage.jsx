import React, { useState } from 'react';
import classes from './MainPage.module.scss';
import NavBar from '../../components/NavBar/NavBar';
import LargeTab from '../../components/LargeTab/LargeTab';
import SmallTab from '../../components/SmallTab/SmallTab';
import {Switch, Route} from 'react-router-dom';
import SideDrawer from '../../components/SideDrawer/SideDrawer';
import BackDrop from '../../elements/BackDrop/BackDrop';

const MainPage = () => {

    const [sdShow, setSdShow] = useState(false);
    const [bdShow, setBdShow] = useState(false);

    const sdToggleHandler = () => {
        setBdShow(!bdShow);
        setSdShow(!sdShow);
    }

    return (
        <div className={classes.MainPage}>
            <NavBar sdToggleHandler={sdToggleHandler}/>
            
            <Switch>
                <Route path='/main/convs'>
                    <SmallTab tabName='convs'/>
                </Route>

                <Route path='/main/addconv'>
                    <SmallTab tabName='addconv'/>
                </Route>

                <Route path='/main/friends'>
                    <SmallTab tabName='friends'/>
                </Route>

                <Route path='/main/addcontact'>
                    <SmallTab tabName='addcontact'/>
                </Route>

                <Route path='/main/addtogroup'>
                    <SmallTab tabName='addtogroup'/>
                </Route>

                <Route path='/main/creategroup'>
                    <SmallTab tabName='addtogroup'/>
                    <LargeTab tabName='creategroup'/>
                </Route>

                <Route path='/main/profile'>
                    <div className={classes.Hidden}></div>
                    <LargeTab tabName='profile'/>
                </Route>
            </Switch>
        </div>
    )
}

export default MainPage
