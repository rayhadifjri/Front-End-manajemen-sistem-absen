import { Table, Modal, Button, Label, TextInput, Alert, Select } from 'flowbite-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dropdown } from 'flowbite-react';
import { HiOutlineExclamationCircle, HiOutlineArrowRight } from 'react-icons/hi';

const Presence = () => {
    const [token, setToken] = useState("");
    const [users, setUsers] = useState([])

    useEffect(() => {
        tokenization(); // Panggil fungsi tokenization saat komponen dimuat
    }, []);

    // useEffect(() => {
    //     if (token) {
    //         getUsersbyProdi(); // Panggil getUsers setelah token didapatkan
    //     }
    // }, [token]);

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

    // const getUsersbyProdi = async (id_prodi) => {
    //     try {
    //         const response = await axiosJWT.get(`/getUsersbyProdi/8`);
    //         // Mengurutkan daftar pengguna berdasarkan nama mereka secara alfabetis
    //         const sortedUsers = response.data.sort((a, b) => a.username.localeCompare(b.username));
    //         setUsers(sortedUsers);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // const getProdiText = (id_prodi) => {
    //     switch (id_prodi) {
    //         case 1:
    //             return "Kedokteran Militer";
    //         case 2:
    //             return "Farmasi Militer";
    //         case 3:
    //             return "Matematika Militer";
    //         case 4:
    //             return "Fisika Militer";
    //         case 5:
    //             return "Kimia Militer";
    //         case 6:
    //             return "Biologi Militer";
    //         case 7:
    //             return "Elektro Militer";
    //         case 8:
    //             return "Informatika Militer";
    //         case 9:
    //             return "Mesin Militer";
    //         case 10:
    //             return "Sipil Militer";
    //         default:
    //             return "Unknown Prodi";
    //     }
    // };
    // console.log(id_prodi);
    return (
        <div>
            <>
                <div className="flex p-4 ml-10">
                    <div className="max-w-md p-4">
                        <div className="mb-2 block">
                            <Label htmlFor="countries" value="Select your country" />
                        </div>
                        <Select id="countries" required>
                            <option>United States</option>
                            <option>Canada</option>
                            <option>France</option>
                            <option>Germany</option>
                        </Select>
                    </div>
                    <div className="max-w-md p-4">
                        <div className="mb-2 block">
                            <Label htmlFor="countries" value="Select your country" />
                        </div>
                        <Select id="countries" required>
                            <option>United States</option>
                            <option>Canada</option>
                            <option>France</option>
                            <option>Germany</option>
                        </Select>
                    </div>
                    <div className="p-4 items-center justify-center">
                        <div className="mb-2 block">
                            <Label htmlFor="countries" value="Kirim" />
                        </div>
                        <Button className=''>
                            <HiOutlineArrowRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <Table striped>
                        <Table.Head>
                            <Table.HeadCell>No</Table.HeadCell>
                            <Table.HeadCell>Nama</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Prodi</Table.HeadCell>
                            <Table.HeadCell>
                                <span className="sr-only">Edit</span>
                            </Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="">
                            {/* {users.map((user, index) => (
                                <Table.Row key={user.id_user} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>{index + 1}</Table.Cell>
                                    <Table.Cell>{user.username}</Table.Cell>
                                    <Table.Cell>{user.email}</Table.Cell>
                                    <Table.Cell>{getProdiText(user.id_prodi)}</Table.Cell>
                                    <Table.Cell>
                                        <Dropdown label="Pengaturan" dismissOnClick={false} className='border-gray-200'>
                                            <Dropdown.Item
                                            >Edit Pengguna</Dropdown.Item>
                                        </Dropdown>
                                    </Table.Cell>
                                </Table.Row>
                            ))
                            } */}
                        </Table.Body>
                    </Table>
                </div>
            </>
        </div>
    )
}

export default Presence;