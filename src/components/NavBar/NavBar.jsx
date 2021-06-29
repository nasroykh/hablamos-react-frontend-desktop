import React from 'react';
import {useSelector} from 'react-redux';
import Button from '../../elements/Button/Button';
import Logo from '../../elements/Logo/Logo';
import classes from './NavBar.module.scss';
import {ReactComponent as NavConv} from '../../assets/conv-icon.svg';
import {ReactComponent as NavFriends} from '../../assets/friends-icon.svg';
import {ReactComponent as NavProfile} from '../../assets/profile-icon.svg';
import {ReactComponent as NavSet} from '../../assets/settings-icon.svg';
import {ReactComponent as NavLogout} from '../../assets/logout-icon.svg';
import {NavLink} from 'react-router-dom'

const NavBar = (props) => {

    const _id = useSelector(state => state.user._id);
    const baseUrl = useSelector(state => state.user.baseUrl);

    let pictureUrl = `${baseUrl}/users/${_id}/picture?${Date.now()}`;

    return (
        <nav className={`${classes.NavBar} ${props.isDarkMode ? '' : classes.LightMode}`}>
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
                <li onClick={props.logoutHandler}>
                    <NavLink to='/signin'>
                        <NavLogout/>
                    </NavLink>
                </li>
            </ul>
            <Button btnType='profile-pic' to='/'><img src={pictureUrl} alt="Profile pic" loading='lazy' /></Button>
        </nav>
    )
}

export default NavBar
