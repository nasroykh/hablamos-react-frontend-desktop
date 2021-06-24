import React from 'react'
import classes from './Message.module.scss';

const Message = (props) => {

    let pictureUrl = `http://localhost:4444/users/${props.sender}/picture?${Date.now()}`;
    let fileUrl = `http://localhost:4444/convs/${props.id}/file`;

    return (
        <li className={`${classes.Message} ${props.user ? classes.UserMessage : ''} ${props.isFile ? classes.FileMessage : ''}`}>
            {props.user ? null : <img src={pictureUrl} alt="" />}
            <span>{props.isFile ? 
                <img src={fileUrl} alt="file is loading..." loading='lazy' onClick={() => {window.open(fileUrl, '_blank')}} /> : 
                <span>{props.message}</span>}
            </span>
            <span>{props.time}</span>
        </li>
    )
}

export default Message;
