import classes from './App.module.scss';
import React, {useEffect, useState} from 'react';
import socketIOClient from "socket.io-client";
import {useSelector, useDispatch} from 'react-redux';
import {Switch, Route, Redirect, useHistory} from 'react-router-dom'
import { isMobile } from "react-device-detect";
// import LoadingPage from './containers/LoadingPage/LoadingPage';
import LoadingSpinner from './elements/LoadingSpinner/LoadingSpinner';
import BackDrop from './elements/BackDrop/BackDrop';
import LandingPage from './containers/LandingPage/LandingPage';
import SignUpPage from './containers/SignUpPage/SignUpPage';
import SignInPage from './containers/SignInPage/SignInPage';
import MainPage from './containers/MainPage/MainPage';
import DialogBox from './components/DialogBox/DialogBox';
import {checkAuth, logout} from './store/auth/auth-actions';
import {userActions} from './store/user/user-slice';

// const ENDPOINT = "https://fierce-inlet-31066.herokuapp.com"; 
const ENDPOINT = "ws://localhost:4444"; 
export const socket = socketIOClient(ENDPOINT);

const App = () => {

	let isAuth = useSelector(state => state.auth.isAuth);
	let token = useSelector(state => state.auth.token);
	let isLoading = useSelector(state => state.user.isLoading);
	
	const dispatch = useDispatch();

	const history = useHistory();

	const [bdShow, setBdShow] = useState(false);
	const [tabMenuShow, setTabMenuShow] = useState(false);

	useEffect(() => {
        socket.on('message:receive', (payload) => {
			if (payload.file) {
				dispatch(userActions.receiveFile({
					_id: payload.lastMessageId,
					sender: payload.sender,
					time: payload.time,
					file: true
				}));
			} else {
				dispatch(userActions.receiveMessage({
					message: payload.message,
					sender: payload.sender,
					time: payload.time
				}));
			}
        });
    }, [dispatch]);

	useEffect(() => {
		// if (isMobile) {
		// 	window.location.href = 'https://m.hablamos.me';
		// } 

		dispatch(checkAuth(localStorage.getItem('token')));

		socket.on("connection", () => {
			console.log('Connected to socket!');
		});
		
	}, [dispatch])
	
	const bdClickHandler = () => {
		setBdShow(false);
		setTabMenuShow(false);
	}

	const tabMenuToggleHandler = () => {
		setBdShow(!bdShow);
		setTabMenuShow(!tabMenuShow);
	}

	const logoutHandler = (e) => {
        e.preventDefault();

        dispatch(logout(token));

        history.push('/');
    }
	
 	return (
		<div className={classes.App}>
			<DialogBox/>
			{isLoading ? <BackDrop loading/> : null}
			{isLoading ? <LoadingSpinner/> : null}
			<Switch>

				<Route path='/main'>
					{isAuth ? 
						<MainPage
							bdShow={bdShow}
							tabMenuToggleHandler={tabMenuToggleHandler}
							tabMenuShow={tabMenuShow}
							bdClickHandler={bdClickHandler}
							logoutHandler={logoutHandler}/> : <Redirect to='/'/>}			
				</Route>

				<Route path='/signin'>
					{isAuth ? <Redirect to='/main/convs'/> : <SignInPage/>}
				</Route>

				<Route path='/signup'>
					<SignUpPage/>
				</Route>

				<Route path='/'>
					{/* <LoadingPage/> */}
					{isAuth ? <Redirect to='/main/convs'/> : <LandingPage/>}
				</Route>

			</Switch>
		</div>
  	);
}

export default App;
