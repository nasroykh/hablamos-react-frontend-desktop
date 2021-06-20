import React from 'react'
import classes from './Message.module.scss';
import pic from '../../../assets/demo-profile-pic.jpg';

const Message = (props) => {

    let pictureUrl = `http://localhost:4444/users/${props.friendId}/picture?${Date.now()}`;
    let fileUrl = `http://localhost:4444/convs/${props.id}/file`;

    return (
        <li className={`${classes.Message} ${props.user ? classes.UserMessage : ''}`}>
            {props.user ? null : <img src={pictureUrl} alt="" />}
            <span>{props.isFile ? <img src={fileUrl} alt="" loading='lazy' /> : props.message}</span>
            <span>{props.time}</span>
        </li>
    )
}

export default Message;
