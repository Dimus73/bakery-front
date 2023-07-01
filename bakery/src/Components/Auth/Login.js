import {useDispatch, useSelector} from 'react-redux'
import { setUser } from '../../redux/action';
import { useNavigate } from 'react-router-dom'

const Login = () => {
	const dispatch = useDispatch();
	const user = useSelector (state => state.user)
	const navigate = useNavigate();


	const logInFunction = async (e) => {
		e.preventDefault()
		const username = e.target.elements.username.value;
		const password = e.target.elements.password.value;
		console.log(username, password);
		const BASE_URL = process.env.REACT_APP_BASE_URL
		const URL = BASE_URL + '/api/auth/login'
	
		
		try {
			const reqData = {
				method : 'POST',
				headers:{
					'Content-type' : 'application/json'
				},
				body:JSON.stringify({
					username,
					password
				})
			}
			console.log(reqData);

			const data = await fetch(URL, reqData); 
			const result = await data.json()

			localStorage.setItem( 'user', JSON.stringify (result) );
			dispatch(setUser(result));
			console.log('In login function', result);
			navigate( '/' );

		} catch (error) {
			console.log('No log in', error);
		}

	}

	return (
		<>
			<h1>Login page</h1>
			<h2>{user.username}</h2>
			<form action="" onSubmit={logInFunction}>
				<input type="text" name="username" />
				<input type="text" name="password" />
				<button type="submit">Login</button>
			</form>
			<div>
				<br /><br /><hr />
				<h2>Current user info:</h2>
				<h6>User ID: {user.userId}</h6>
				<h6>User name: {user.username}</h6>
				<h6>User roles: {user.rolesList}</h6>
				<h6>User token: {user.token}</h6>
			</div>
		</>
	)
}

export default Login