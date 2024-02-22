import React, { useState, useEffect } from "react";
import { Button, Label, TextInput, Select } from 'flowbite-react';
import axios from "axios";
import { Alert } from 'flowbite-react';
import { Transition } from '@headlessui/react';

const CreateProfile = () => {
    const [token, setToken] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [no_personel, setNo_Personel] = useState("");
    const [selectedRole, setSelectedRole] = useState(""); // State untuk menyimpan role yang dipilih
    const [id_level, setId_Level] = useState(""); // State untuk menyimpan id_level
    const [showAlert, setShowAlert] = useState(false); // State untuk menunjukkan apakah alert harus ditampilkan

    useEffect(() => {
        tokenization();
    }, []);

    const tokenization = async () => {
        try {
            const response = await axios.get("http://localhost:5000/refreshToken");
            setToken(response.data.accessToken);
        } catch (error) {
            console.error(error);
        }
    };

    const axiosJWT = axios.create({
        baseURL: "http://localhost:5000",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const register = async (username, password, email, no_personel, id_level) => {
        try {
            const response = await axiosJWT.post("/register", {
                username,
                password,
                email,
                no_personel,
                id_level
            });
            // Menampilkan alert hanya jika status response adalah 2xx
            if (response.status >= 200) {
                setShowAlert(true);
                // Reset form fields
                setUsername("");
                setPassword("");
                setEmail("");
                setNo_Personel("");
                setSelectedRole("");
                setId_Level("");
            }
        } catch (error) {
            console.error(error);
        }
    };


    // Objek pemetaan untuk memetakan setiap peran ke level ID yang sesuai
    const roleToIdMap = {
        "Admin": 1,
        "Karo AK": 2,
        "Dekan": 3,
        "Kaprodi": 4,
        "Dosen": 5,
        "Kadet Mahasiswa": 6
    };

    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
        // Set id_level berdasarkan peran yang dipilih
        setId_Level(roleToIdMap[e.target.value]);
    };

    return (
        <div className="min-h-screen">
            {/* Tampilkan alert hanya jika showAlert bernilai true */}
            <div className={`fixed inset-x-0 top-0 z-[50] flex justify-center transition-all duration-500 transform ${showAlert ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                <Alert color="success" onDismiss={() => setShowAlert(false)} className="w-full sm:w-1/2 lg:w-1/3 mt-4">
                    <span className="font-medium">Info alert!</span> Change a few things up and try submitting again.
                </Alert>
            </div>
            <div className="flex justify-center items-center h-screen">
                <form className="mx-auto w-full max-w-md p-4">
                    <div className="flex flex-col gap-4">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="username" value="Username" />
                            </div>
                            <TextInput
                                id="username"
                                type="username"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required shadow
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="email" value="Email" />
                            </div>
                            <TextInput
                                id="email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required shadow
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="no_personel" value="Nomor Personel" />
                            </div>
                            <TextInput
                                id="no_personel"
                                type="noPersonel"
                                placeholder="No_Personel"
                                value={no_personel}
                                onChange={(e) => setNo_Personel(e.target.value)}
                                required shadow
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="password" value="Password" />
                            </div>
                            <TextInput
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required shadow
                            />
                        </div>
                        <div className="mb-2 block">
                            <Label htmlFor="roles" value="Select your Role" />
                        </div>
                        <Select id="roles" value={selectedRole} onChange={handleRoleChange} required>
                            <option value="">Select Role</option>
                            {Object.keys(roleToIdMap).map((role) => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </Select>
                        <Button
                            type="submit"
                            onClick={async (e) => {
                                e.preventDefault();
                                await register(username, password, email, no_personel, id_level);
                            }}>Register new account</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateProfile;