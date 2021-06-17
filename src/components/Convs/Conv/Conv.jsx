import React from 'react'
import classes from './Conv.module.scss';
import pic from '../../../assets/demo-profile-pic.jpg';
import {Link} from 'react-router-dom';

const Conv = (props) => {

    let pictureUrl = `http://localhost:4444/users/${props.groupName ? props.id : props.friendId}/picture`;

    return (
        <li className={classes.Conv}>
            <Link to={`/main/convs/chat?_id=${props.id}`}>
                <img src={pictureUrl} alt="Profile pic"/>
                <h3>{props.groupName ? props.groupName : props.name}</h3>
                <p>{props.message}</p>
                <span>{props.time}</span>
            </Link>
        </li>
    )
}

export default Conv
