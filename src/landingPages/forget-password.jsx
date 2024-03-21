import React, { useState, useEffect } from "react";
import { Button, Card, Checkbox, Label, TextInput } from 'flowbite-react';
import { useDispatch, useSelector } from "react-redux";
import NavbarComp from "../Components/navbar";
import { useNavigate } from "react-router-dom";
import { reset } from "../features/authSlice";
import axios from "axios";


const ForgetPassword = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const dispatch = useDispatch();

    const { user, isError, isSuccess, isLoading, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (user || isSuccess) {
            navigate('/login');
        }
        dispatch(reset());
    }, [user, isSuccess, dispatch, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/forget-password', {
            email
        }).then(res => {
            if (res.data.status === "Success"){
                navigate('/login');
            }else{
                console.log(res.data.message);
            }
        }).catch(err => {
            console.log(err);
        });
    };

    return (
        <div>
            <NavbarComp />
            <div className="flex items-center justify-center h-screen">
                <Card className="md:w-full md:max-w-md md:p-6 p-3">
                    <form onSubmit={handleSubmit} className="flex flex-col md:gap-4 gap-2">
                        {isError && <p className="text-center text-red-700">{message}</p>}
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="email1" value="Email" />
                            </div>
                            <TextInput id="email1" type="text" placeholder="email" required
                                value={email} onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />
                        </div>
                        <Button type="submit">
                            {isLoading ? 'Loading...' : 'Reset Password'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    )
}

export default ForgetPassword;
