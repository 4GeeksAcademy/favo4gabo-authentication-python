import React, { useState, useContext } from "react"
import { Context } from "../store/appContext"
import { Navigate, useNavigate } from "react-router-dom"

export const Signup = () => {
	const { store, actions } = useContext(Context)
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	
	const navigate = useNavigate()
	function signup(e) {
	  e.preventDefault()
	  actions.registerUser(email, password)
	}
	return (
	  <div className="container">
		<form onSubmit={(e) => signup(e)}>
		  <div className="mb-3">
			<label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
			<input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} id="exampleInputEmail1" aria-describedby="emailHelp" />
			<div id="emailHelp" className="form-text" >We'll never share your email with anyone else.</div>
		  </div>
		  <div className="mb-3">
			<label htmlFor="exampleInputPassword1" className="form-label">Password</label>
			<input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} id="exampleInputPassword1" />
		  </div>
		  <button type="submit" className="btn btn-primary" >Submit</button>
		</form>
		<button type="button" className="btn btn-primary" onClick={() => navigate("/login")}>Login</button>
	  </div>
	)
};
