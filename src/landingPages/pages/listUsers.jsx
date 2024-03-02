import { Table, Modal, Button, Label, TextInput, Alert } from 'flowbite-react';
import React, { useState, useEffect } from "react";
import { useNavigate, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetwhoAmI } from "../../features/authSlice"; 
import axios from 'axios';
import { Dropdown } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const Listusers = () => {
    const [users, setUsers] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState(null); // Menyimpan id_user yang akan dihapus
    const [updateUserId, setUpdateUserId] = useState(null); // Menyimpan id_user yang akan diupdate
    const [openSecondModal, setOpenSecondModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // Deklarasi state searchQuery
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showAlert, setShowAlert] = useState(false); // State untuk menunjukkan apakah alert harus ditampilkan
    const [token, setToken] = useState("");
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

    useEffect(() => {
        tokenization(); // Panggil fungsi tokenization saat komponen dimuat
    }, []);

    useEffect(() => {
        if (token) {
            getUsers(); // Panggil getUsers setelah token didapatkan
        }
    }, [token]);

    useEffect(() => {
        if (!openModal) {
            setOpenModal(false);
        }
    }, [openModal]);

    useEffect(() => {
        if (!openSecondModal) {
            setOpenSecondModal(false);
        }
    }, [openModal]);

    const tokenization = async () => {
        try {
            const response = await axios.get("http://localhost:5000/refreshToken");
            setToken(response.data.accessToken);
            // console.log(token); // Ini mungkin masih menampilkan token lama, karena setState bersifat asinkron
        } catch (error) {
            console.error(error);
        }
    };

    const axiosJWT = axios.create({
        baseURL: "http://localhost:5000", // Set baseURL untuk axiosJWT
        headers: {
            Authorization: `Bearer ${token}` // Atur header Authorization secara global
        }
    });

    // Fungsi untuk menampilkan teks peran sesuai dengan nomor peran
    const getRoleText = (id_level) => {
        switch (id_level) {
            case 1:
                return "Admin";
            case 2:
                return "Karo AK";
            case 3:
                return "Dekan";
            case 4:
                return "Kaprodi";
            case 5:
                return "Dosen";
            case 6:
                return "Kadet Mahasiswa";
            default:
                return "Unknown Role";
        }
    };

    const getUsers = async () => {
        try {
            const response = await axiosJWT.get("/getUsers");
            // Mengurutkan daftar pengguna berdasarkan nama mereka secara alfabetis
            const sortedUsers = response.data.sort((a, b) => a.username.localeCompare(b.username));
            setUsers(sortedUsers);
        } catch (error) {
            console.error(error);
        }
    }

    const getUsersbyPartialUsername = async (partialUsername) => {
        try {
            const response = await axiosJWT.get(`/getUsersbyPartialUsername/${encodeURIComponent(partialUsername)}`);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    const handleSearch = async () => {
        if (!searchQuery || searchQuery.trim() === "") {
            getUsers();
            return;
        }

        try {
            const users = await getUsersbyPartialUsername(searchQuery);
            setUsers(users);
        } catch (error) {
            console.error(error);
        }
    };

    const editUser = async (id_user, username, password) => {
        try {
            const response = await axiosJWT.patch(`/editUser/${id_user}`, {
                username,
                password
            });
            if (response.status >= 200) {
                setShowAlert(true);
                getUsers();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const deleteUser = async (id_user) => {
        try {
            const response = await axiosJWT.delete(`/deleteUser/${id_user}`);
            if (response.status >= 200)
            {
                setShowAlert(true);
                getUsers();
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="">
            <div className={`fixed inset-x-0 top-0 z-[50] flex justify-center transition-all duration-500 transform ${showAlert ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                <Alert color="success" onDismiss={() => setShowAlert(false)} className="w-full sm:w-1/2 lg:w-1/3 mt-4">
                    <span className="font-medium">Info alert!</span> Change a few things up and try submitting again.
                </Alert>
            </div>
            <div className="grid grid-cols-3 gap-4 p-4">
                <div className="col-span-1">
                    <label htmlFor="default-search" className="text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input
                            type="search"
                            id="default-search"
                            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search User"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                            required
                        />
                        <button type="button" onClick={handleSearch} className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                    </div>
                </div>
                <div className="col-span-2"></div>
            </div>
            <div className="overflow-x-auto">
                <Table striped>
                    <Table.Head>
                        <Table.HeadCell>No</Table.HeadCell>
                        <Table.HeadCell>Nama</Table.HeadCell>
                        <Table.HeadCell>Email</Table.HeadCell>
                        <Table.HeadCell>Peran</Table.HeadCell>
                        <Table.HeadCell>
                            <span className="sr-only">Edit</span>
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="">
                        {users.map((user, index) => (
                            <Table.Row key={user.id_user} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell>{index + 1}</Table.Cell>
                                <Table.Cell>{user.username}</Table.Cell>
                                <Table.Cell>{user.email}</Table.Cell>
                                <Table.Cell>{getRoleText(user.id_level)}</Table.Cell>
                                <Table.Cell>
                                    <Dropdown label="Pengaturan" dismissOnClick={false} className='border-gray-200'>
                                        <Dropdown.Item onClick={() => {
                                            setUpdateUserId(user.id_user);// Hanya menyimpan id_user
                                            setUsername(user.username); // Set nilai awal untuk input username
                                            setOpenSecondModal(true);
                                        }}>Edit Pengguna</Dropdown.Item>
                                        {user.id_level !== 1 && ( // Hanya tampilkan tombol delete jika peran bukan admin
                                            <>
                                                <Dropdown.Item onClick={() => {
                                                    setDeleteUserId(user.id_user);
                                                    setOpenModal(true);
                                                }}>
                                                    Hapus Pengguna
                                                </Dropdown.Item>
                                            </>
                                        )}
                                    </Dropdown>
                                </Table.Cell>
                            </Table.Row>
                        ))
                        }
                    </Table.Body>
                </Table>
            </div>
            {/* Modal untuk konfirmasi penghapusan pengguna */}
            <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Apakah Anda yakin ingin menghapus pengguna ini?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={async (e) => {
                                e.preventDefault();
                                await deleteUser(deleteUserId);
                                setOpenModal(false); // Menutup popup setelah pengguna dihapus
                            }}>
                                Ya, saya yakin
                            </Button>
                            <Button color="gray" onClick={() => setOpenModal(false)}>
                                Tidak, batalkan
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            {/* Modal untuk konfirmasi update pengguna */}
            <Modal show={openSecondModal} size="md" onClose={() => setOpenSecondModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Perbarui Akun</h3>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="Username" value="Username" />
                            </div>
                            <TextInput
                                id="username"
                                placeholder="Nama Pengguna Baru"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="password" value="Your password" />
                            </div>
                            <TextInput id="password" type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password Baru"
                            />
                        </div>
                        <div className="w-full">
                            <Button onClick={async (e) => {
                                e.preventDefault();
                                await editUser(updateUserId, username, password); // Menggunakan id_user, username, dan password
                                setOpenSecondModal(false); // Menutup popup setelah pengguna diperbarui
                            }}>Kirim</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Listusers;
