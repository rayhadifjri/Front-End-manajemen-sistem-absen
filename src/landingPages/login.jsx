import React, { useState, useEffect } from "react";
import { Button, Card, Label, TextInput } from 'flowbite-react';
import { useDispatch, useSelector } from "react-redux";
import NavbarComp from "../Components/navbar";
import { useNavigate } from "react-router-dom";
import { LoginUser, reset } from "../features/authSlice";
import { Link } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [showNotification, setShowNotification] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(false); // Tambahkan state untuk menandai apakah email valid
    const dispatch = useDispatch();

    const { user, isError, isSuccess, isLoading, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            setShowNotification(true);
            const timeout = setTimeout(() => {
                setShowNotification(false);
            }, 5000);
            return () => clearTimeout(timeout);
        }
    }, [isError]);

    useEffect(() => {
        if (user || isSuccess) {
            navigate('/');
        }
        dispatch(reset());
    }, [user, isSuccess, dispatch, navigate]);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        // Validasi email
        // Contoh validasi sederhana untuk memeriksa format dan apakah email merupakan alamat Gmail
        const emailRegex = /^[^\s@]+@gmail\.com$/;
        setIsEmailValid(emailRegex.test(e.target.value));
    };

    const Auth = (e) => {
        e.preventDefault();
        if (isEmailValid) { // Periksa apakah email sudah divalidasi
            dispatch(LoginUser({ email, password }));
        } else {
            alert("Please enter a valid Gmail address."); // Alert jika email tidak valid
        }
    };

    return (
        <>
            <NavbarComp />
            <div className="flex items-center justify-center h-screen">
                <Card className="md:w-full md:max-w-md md:p-6 p-3">
                    <form onSubmit={Auth} className="flex flex-col md:gap-4 gap-2">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="email1" value="Email" />
                            </div>
                            <TextInput id="email1" type="text" placeholder="email" required
                                value={email} onChange={handleEmailChange} // Gunakan fungsi handleEmailChange
                            />
                        </div>
                        <div className={`transition-all duration-100 transform ${isEmailValid ? 'translate-y-0 opacity-100 h-auto' : 'opacity-0 -translate-y-6 h-0'}`}>
                            <div className="mb-2 block">
                                <Label htmlFor="password1" value="Password" />
                            </div>
                            <TextInput id="password1" type="password" placeholder="password" required
                                value={password} onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                            />
                        </div>
                        {showNotification && isError && (
                        <p className="text-center text-red-700">{message}</p>
                    )}
                        {isEmailValid && ( // Tampilkan link "Forget Password" jika email valid
                            <div className="flex justify-end gap-2">
                                <Link to={"/forget-password"} className="text-red-900 font-medium" >Forget Password</Link>
                            </div>
                        )}
                        <Button type="submit" disabled={!isEmailValid || isLoading}>
                            {isLoading ? 'Loading...' : 'Login'}
                        </Button>
                    </form>
                </Card>
            </div>
        </>
    );
}

export default Login;