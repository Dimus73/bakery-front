import {Link, Outlet} from 'react-router-dom'
import TopBar from '../Menu/TopBar'

const Layout = () => {

	return (
		<>
			<TopBar />
			<Outlet />
			<footer>---=====Footer=====----- 2023</footer>
		</>
	)
}

export {Layout}