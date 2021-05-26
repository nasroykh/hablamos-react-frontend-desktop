import React from 'react'
import classes from './Conv.module.scss';
import pic from '../../../assets/demo-profile-pic.png';
import {Link} from 'react-router-dom';

const Conv = (props) => {
    return (
        <li className={classes.Conv}>
            <Link to="#">
                <img src={pic} alt=""/>
                <h3>{props.name}</h3>
                <p>{props.message}</p>
                <span>{props.time}</span>
            </Link>
        </li>
    )
}

export default Conv
