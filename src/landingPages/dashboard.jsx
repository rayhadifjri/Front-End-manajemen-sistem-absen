import Nav from "../Components/nav";
import Sidebars from "../Components/side";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ProtectedRoutes from "../context/ProtectedRoutes";
import React, { useState, useEffect } from "react";
import { useNavigate, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetwhoAmI } from "../features/authSlice";

const Dashboard = () => {
    const dispatch = useDispatch()
    const [username, setUsername] = useState("");
    const [token, setToken] = useState("");
    const [expire, setExpire] = useState("");
    const [email, setEmail] = useState("");
    const [id_level, setId_level] = useState("");
    const [id_user, setId_user] = useState("");
    const navigate = useNavigate();
    const { isError } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(GetwhoAmI())
            .unwrap()
            .then((decoded) => { // Now 'decoded' is the decoded token data
                setUsername(decoded.username); // Update username state
                setEmail(decoded.email); // Update email state
                setToken(decoded.accessToken); // Update token state
                setExpire(decoded.exp); // Update expire state
                setId_level(decoded.id_level); // Update id_level state
                setId_user(decoded.id_user); // Update id_user state
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
                if (isError) {
                    navigate('/login');
                }
            });
    }, [dispatch, navigate, isError]);


    return (
        <>
            <div className="flex flex-col overflow-hidden">
                <Nav className="flex-grow-0" {...{ username, email }} />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebars className="min-w-0 flex-shrink-0 overflow-hidden" {...{ id_level, id_user }} />
                    <div className="flex-1 overflow-y-auto md:ml-64 sm:ml-0">
                        <ProtectedRoutes className="flex-1" {...{ token, id_level, id_user }} /> {/* Pass token as prop */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;