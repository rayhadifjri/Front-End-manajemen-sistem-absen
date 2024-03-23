import React, { useState, useEffect } from "react";
import { Button, Card, Label, TextInput } from 'flowbite-react';
import { useDispatch, useSelector } from "react-redux";
import NavbarComp from "../Components/navbar";
import { useNavigate, useParams } from "react-router-dom";
import { reset } from "../features/authSlice";
import axios from "axios";

const ResetPassword = () => {
    const navigate = useNavigate();
    const { id_user, token } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // Tambahkan state untuk konfirmasi password
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
        // Validasi konfirmasi password
        if (password !== confirmPassword) {
            dispatch({ type: 'AUTH_ERROR', payload: 'Password and confirm password do not match.' });
            return;
        }

        axios.post(`http://localhost:5000/reset-password/${id_user}/${token}`, {
            password
        }).then(res => {
            console.log(res.data); // Cetak respons ke konsol
            if (res.data[0] === 1) {
                navigate('/login');
            } else {
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
                                <Label htmlFor="password" value="Password" />
                            </div>
                            <TextInput id="password" type="password" placeholder="Password" required
                                value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="confirmPassword" value="Confirm Password" />
                            </div>
                            <TextInput id="confirmPassword" type="password" placeholder="Confirm Password" required
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        {password !== confirmPassword && (
                            <p className="text-xs text-red-700">Password and confirm password tidak sama</p>
                        )}
                        <Button type="submit">{isLoading ? 'Loading...' : 'New Password'}</Button>
                    </form>
                </Card>
            </div>
        </div>
    )
}

export default ResetPassword;