import React from 'react';
import classes from './LandingPage.module.scss';
import Logo from '../../elements/Logo/Logo';
import Button from '../../elements/Button/Button'
import LandingImage from '../../elements/LandingImage/LandingImage';

const LandingPage = () => {
    return (
        <div className={classes.LandingPage}>
            <div className={classes.LandingText}>
                <Logo left/>
                <div>
                    <h1>Hablamos®,</h1>
                    <h1> a free and easy-to-use chat app</h1>
                    <Button to='/signup' btnType='primary'>Create an account</Button>
                </div>
                <div>
                    <h2>Got an account? Login now!</h2>
                    <Button to='/signin' btnType='secondary'>Login</Button>
                </div>
            </div>
            <div className={classes.LandingImage}>
                <LandingImage/>
            </div>
        </div>
    )
}

export default LandingPage;