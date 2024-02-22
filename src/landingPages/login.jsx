import React, { useState, useEffect } from "react";
import { Button, Card, Checkbox, Label, TextInput } from 'flowbite-react';
import { useDispatch, useSelector } from "react-redux";
import NavbarComp from "../Components/navbar";
import { useNavigate } from "react-router-dom";
import { LoginUser, reset } from "../features/authSlice";

const Login = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    const {user, isError, isSuccess, isLoading, message} = useSelector(
        (state) => state.auth
    );

    useEffect(() =>{
        if(user || isSuccess) {
            navigate('/');
        }
        dispatch(reset());
    },[user, isSuccess, dispatch, navigate]);

    const Auth = (e) => {
        e.preventDefault();
        dispatch(LoginUser({ username, password }));
    };

    return (
        <>
            <NavbarComp />
            <div className="flex items-center justify-center h-screen">
                <Card className="md:w-full md:max-w-md md:p-6 p-3">
                    <form onSubmit={Auth} className="flex flex-col md:gap-4 gap-2">
                        {isError && <p className="text-center text-red-700">{message}</p>}
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="email1" value="Username" />
                            </div>
                            <TextInput id="email1" type="text" placeholder="Username" required
                                value={username} onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="password1" value="Password" />
                            </div>
                            <TextInput id="password1" type="password" placeholder="password" required
                                value={password} onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="remember" />
                            <Label htmlFor="remember">Remember me</Label>
                        </div>
                        <Button type="submit">
                            {isLoading ? 'Loading...' : 'Login'}
                        </Button>
                    </form>
                </Card>
            </div>
        </>
    );
}

export default Login;