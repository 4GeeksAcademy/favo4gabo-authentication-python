import React, { useState, useContext } from "react"
import { Context } from "../store/appContext"
import { Navigate, useNavigate } from "react-router-dom"

export const Private = () => {
    const navigate = useNavigate()
	const { store, actions } = useContext(Context);

    return (
        <>
            {
                localStorage.getItem("token") === null ?
                    navigate("/login") :
                    <>
                        <h1>Hola welcome</h1>
                       
                        
                    </>
            }
        </>
    )
}