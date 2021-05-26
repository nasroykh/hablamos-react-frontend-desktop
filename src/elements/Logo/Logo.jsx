import React from 'react';
import classes from './Logo.module.scss';
import {Link} from 'react-router-dom';
import {ReactComponent as WithText} from '../../assets/logo-with-text.svg';
import {ReactComponent as WithoutText} from '../../assets/logo-without-text.svg';
import {ReactComponent as LeftText} from '../../assets/logo-with-text-left.svg';

const Logo = (props) => {
    return (
        <div className={classes.Logo}>
            <Link to='/'>
                {props.text ? <WithText/> : null}
                {props.without ? <WithoutText/> : null}
                {props.left ? <LeftText/> : null}
            </Link>
        </div>
    )
}

export default Logo
