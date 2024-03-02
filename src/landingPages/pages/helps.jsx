import React, { useState, useEffect } from "react";
import { useNavigate, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetwhoAmI } from "../../features/authSlice"; 

const Help = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { isError } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(GetwhoAmI())
    }, [dispatch]);

    useEffect(() =>{
        if (isError) {
            navigate('/login');
        }
    }, [isError, navigate]);

    return (
        <div>
            <h1>Help</h1>
        </div>
    )
}

export default Help
