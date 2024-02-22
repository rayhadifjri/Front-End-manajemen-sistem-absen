import React, { useState, useEffect } from "react";
import Nav from "../Components/nav";
import Sidebars from "../Components/side";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Route } from "react-router-dom";
import ProtectedRoutes from "../context/ProtectedRoutes";
import { useDispatch, useSelector } from "react-redux";
import { GetwhoAmI } from "../features/authSlice"; 

const Dashboard = () => {
    const dispatch = useDispatch()
    const [username, setUsername] = useState("");
    const [token, setToken] = useState("");
    const [expire, setExpire] = useState("");
    const [email, setEmail] = useState("");
    const [id_level, setId_level] = useState("");
    const navigate = useNavigate();
    const { isError } = useSelector((state) => state.auth);


    useEffect(() => {
        refreshToken();
    }, []);

    const refreshToken = async () => {
        try {
            const response = await axios.get("http://localhost:5000/refreshToken");
            const decoded = jwtDecode(response.data.accessToken);
            setToken(response.data.accessToken);
            setUsername(decoded.username);
            setEmail(decoded.email);
            setId_level(decoded.id_level);
            setExpire(decoded.exp);
        } catch (error) {
            if (error.response) {
                navigate("/login");
            }
        }
    };


    return (
        <>
            <div className="h-screen flex flex-col overflow-hidden">
                <Nav {...{ username, email }} />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebars className="flex-shrink-0 overflow-hidden" {...{ id_level }} />
                    <div className="flex-1 overflow-y-auto">
                        <ProtectedRoutes {...{ token, id_level }} /> {/* Pass token as prop */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;