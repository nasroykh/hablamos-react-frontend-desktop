import React from 'react';
import classes from './BackDrop.module.scss';

const BackDrop = (props) => {
    return (
        <div 
            onClick={props.click} 
            className={`${classes.BackDrop} ${props.loading ? classes.Loading : ''} ${props.bdShow ? classes.Show : ''}`}></div>
    )
}

export default BackDrop
