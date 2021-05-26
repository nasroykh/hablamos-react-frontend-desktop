import React from 'react'
import classes from './Message.module.scss';
import pic from '../../../assets/demo-profile-pic.png';

const Message = (props) => {
    return (
        <li className={`${classes.Message} ${props.user ? classes.UserMessage : ''}`}>
            {props.user ? null : <img src={pic} alt="" />}
            <span>{props.message}</span>
            <span>{props.time}</span>
        </li>
    )
}

export default Message
