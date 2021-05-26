import React from 'react';
import Button from '../../elements/Button/Button';
import Logo from '../../elements/Logo/Logo';
import classes from './NavBar.module.scss';
import pic from '../../assets/demo-profile-pic.png';
import {ReactComponent as NavConv} from '../../assets/conv-icon.svg';
import {ReactComponent as NavFriends} from '../../assets/friends-icon.svg';
import {ReactComponent as NavProfile} from '../../assets/profile-icon.svg';
import {ReactComponent as NavSet} from '../../assets/settings-icon.svg';
import {ReactComponent as NavLogout} from '../../assets/logout-icon.svg';
import {NavLink} from 'react-router-dom'

const NavBar = (props) => {
    return (
        <nav className={classes.NavBar}>
            <Logo without/>
            <ul>
                <li onClick={props.sdToggleHandler}>
                    <NavLink to='/main/convs' activeClassName={classes.Active}>
                        <NavConv/>
                    </NavLink>
                </li>
                <li onClick={props.sdToggleHandler}>
                    <NavLink to='/main/friends' activeClassName={classes.Active}>
                        <NavFriends/>
                    </NavLink>
                </li>
                <li onClick={props.sdToggleHandler}>
                    <NavLink to='/main/profile' activeClassName={classes.Active}>
                        <NavProfile/>
                    </NavLink>
                </li>
                <li onClick={props.sdToggleHandler}>
                    <NavLink to='/main/settings' activeClassName={classes.Active}>
                        <NavSet/>
                    </NavLink>
                </li>
                <li onClick={props.sdToggleHandler}>
                    <NavLink to='/signin'>
                        <NavLogout/>
                    </NavLink>
                </li>
            </ul>
            <Button btnType='profile-pic' to='/main/profile'><img src={pic} alt="" /></Button>
        </nav>
    )
}

export default NavBar
