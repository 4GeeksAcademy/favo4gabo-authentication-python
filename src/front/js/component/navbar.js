import React, {useContext} from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext"

export const Navbar = () => {
	const { store, actions } = useContext(Context)

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					<Link to="/signup">
						<button className="btn btn-primary">Signup</button>
					</Link>
					<button className="btn btn-primary" onClick={()=>{actions.logOut()}}>
						Logout
					</button>
				</div>
			</div>
		</nav>
	);
};
