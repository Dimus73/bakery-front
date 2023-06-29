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
		<nav class="navbar navbar-expand-lg bg-body-tertiary">
			<div class="container-fluid">
				<a class="navbar-brand" to="#">Navbar</a>
				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse" id="navbarSupportedContent">
					<ul class="navbar-nav me-auto mb-2 mb-lg-0">
						<li class="nav-item">
							<Link class="nav-link active" to="/">Home</Link>
						</li>
						<li class="nav-item">
							<Link class="nav-link" to="#">Link</Link>
						</li>
						<li class="nav-item dropdown">
							<Link class="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
								Catalogs
							</Link>
							<ul class="dropdown-menu">
							<li><Link class="dropdown-item" to="/catalog/ingredients">Ingredient</Link></li>
							<li><Link class="dropdown-item" to="/catalog/equipment">Equipment</Link></li>
								<li><Link class="dropdown-item" to="#">Another action</Link></li>
								<li><hr class="dropdown-divider" /></li>
								<li><Link class="dropdown-item" to="#">Something else here</Link></li>
							</ul>
						</li>
						<li class="nav-item">
							<a class="nav-link disabled">Disabled</a>
						</li>
						<li class="ml-auto nav-item">
							<Link class="nav-link" to="/login">Login</Link>
						</li>
						<li class="ml-auto nav-item">
							<Link class="nav-link" to="/" onClick={logOut}>Logout</Link>
						</li>
						<li class="ml-auto nav-item">
							<Link class="nav-link" to="/registry" >Registry</Link>
						</li>

					</ul>
					<div class="collapse navbar-collapse">
						<ul class="navbar-nav me-auto mb-2 mb-lg-0">
							<li><Link to='/login'>Login</Link></li>
						</ul>
					</div>
					<div>USER: | {user.username}</div>
					<form class="d-flex" role="search">
						<input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
						<button class="btn btn-outline-success" type="submit">Search</button>
					</form>
				</div>
			</div>
		</nav>
	)
}

export default TopBar