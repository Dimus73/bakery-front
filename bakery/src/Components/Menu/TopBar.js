import {Link, useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { setUser } from '../../redux/action'

const TopBar = () =>{
	const navigate = useNavigate();
	const dispatch = useDispatch ();
	const user = useSelector(state => state.user)

	const logOut = (e) => {
		const user = { 
			id:'',
			username:'',
			roles:[],
			token:''
		}
		dispatch (setUser(user));
		localStorage.setItem('user', JSON.stringify(user))
		navigate('/');

	}

	return (
		<nav className="navbar navbar-expand-lg bg-body-tertiary">
			<div className="container-fluid">
				<a className="navbar-brand" to="#">Navbar</a>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						<li className="nav-item">
							<Link className="nav-link active" to="/">Home</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="#">Link</Link>
						</li>

						<li className='nav-item dropdown'>
							<Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false" to="#" > 
								Recipe
							</Link>
							<ul className="dropdown-menu">
								<li><Link className="dropdown-item" to="/recipe/list" >List</Link></li>
								<li><Link className="dropdown-item" to="/recipe/create" >Create</Link></li>
							</ul>
						</li>

						<li className="nav-item dropdown">
							<Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
								Catalogs
							</Link>
							<ul className="dropdown-menu">
							<li><Link className="dropdown-item" to="/catalog/ingredients">Ingredient</Link></li>
							<li><Link className="dropdown-item" to="/catalog/equipment">Equipment</Link></li>
								<li><Link className="dropdown-item" to="#">Another action</Link></li>
								<li><hr className="dropdown-divider" /></li>
								<li><Link className="dropdown-item" to="#">Something else here</Link></li>
							</ul>
						</li>

						<li className="nav-item">
							<a className="nav-link disabled">Disabled</a>
						</li>
						<li className="ml-auto nav-item">
							<Link class="nav-link" to="/login">Login</Link>
						</li>
						<li className="ml-auto nav-item">
							<Link className="nav-link" to="/" onClick={logOut}>Logout</Link>
						</li>
						<li className="ml-auto nav-item">
							<Link className="nav-link" to="/registry" >Registry</Link>
						</li>

					</ul>
					<div className="collapse navbar-collapse">
						<ul className="navbar-nav me-auto mb-2 mb-lg-0">
							<li><Link to='/login'>Login</Link></li>
						</ul>
					</div>
					<div>USER: | {user.username}</div>
					<form className="d-flex" role="search">
						<input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
						<button className="btn btn-outline-success" type="submit">Search</button>
					</form>
				</div>
			</div>
		</nav>
	)
}

export default TopBar