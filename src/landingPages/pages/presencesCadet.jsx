import { Table, Modal, Button, Label, TextInput, Alert, Select } from 'flowbite-react';
import React, { useState, useEffect } from "react";
import { useNavigate, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetwhoAmI } from "../../features/authSlice";
import axios from 'axios';
import { Dropdown } from 'flowbite-react';
import { HiOutlineExclamationCircle, HiOutlineArrowRight } from 'react-icons/hi';

const Presence = () => {
    const [token, setToken] = useState("");
    const [users, setUsers] = useState([])
    const [selectedProdi, setSelectedProdi] = useState('');
    const [prodiData, setProdiData] = useState([]);
    const [selectedAngkatan, setSelectedAngkatan] = useState('');
    const [angkatanData, setAngkatanData] = useState([]);
    const [prodi, setProdi] = useState('');
    const [angkatan, setAngkatan] = useState('');
    const [angkatanDetails, setAngkatanDetails] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(GetwhoAmI())
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            navigate('/login');
        }
    }, [isError, navigate]);

    const tokenization = async () => {
        try {
            const response = await axios.get("http://localhost:5000/refreshToken");
            setToken(response.data.accessToken);
            // console.log(token); // Ini mungkin masih menampilkan token lama, karena setState bersifat asinkron
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProdiData();
        fetchAngkatanData();
    }, []);

    const fetchProdiData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/getProdi");
            setProdiData(response.data.data);
            console.log(response.data);
        } catch (error) {
            console.error("Failed to fetch prodi data: ", error);
        }
    };

    const fetchAngkatanData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/getKetangkatan");
            setAngkatanData(response.data.data);
            console.log(response.data);
        } catch (error) {
            console.error("Failed to fetch angkatan data: ", error);
        }
    };

    const getUserbyProdiandAngkatan = async (id_prodi, id_angkatan) => {
        try {
            const response = await axiosJWT.get(`http://localhost:5000/getUserbyProdiandAngkatan`, {
                id_prodi,
                id_angkatan
            });
            return response.data;
        } catch (error) {
            console.log("Failed to fetch user by prodi and angkatan: ", error);
        }
    }

    // Fungsi untuk menangani klik tombol
    const handleButtonClick = async () => {
        try {
            if (selectedProdi && selectedAngkatan) {
                const userData = await getUserbyProdiandAngkatan(selectedProdi, selectedAngkatan);
                console.log(userData); // Anda dapat menangani data pengguna sesuai kebutuhan
            } else {
                console.log("Silakan pilih prodi dan angkatan terlebih dahulu.");
            }
        } catch (error) {
            console.log("Gagal mengambil data pengguna: ", error);
        }
    };

    return (
        <>
            <div className="flex p-4 ml-10">
                <div className="max-w-md p-4">
                    <div className="mb-2 block">
                        <Label htmlFor="ddl_prodi" value="Program Studi" />
                    </div>
                    <Select id="ddl_prodi" required value={selectedProdi} onChange={e => setSelectedProdi(e.target.value)}>
                        <option disabled value="">Pilih Prodi</option>
                        {Array.isArray(prodiData) && prodiData.map((prodi, index) => (
                            <option key={index} value={prodi.id_prodi}>{prodi.nama_prodi}</option>
                        ))}
                    </Select>
                </div>
                <div className="max-w-md p-4">
                    <div className="mb-2 block">
                        <Label htmlFor="ddl_angkatan" value="Angkatan" />
                    </div>
                    <Select id="ddl_angkatan" required value={selectedAngkatan} onChange={e => setSelectedAngkatan(e.target.value)}>
                        <option disabled value="">Pilih Angkatan</option>
                        {Array.isArray(angkatanData) && angkatanData.map((angkatan, index) => (
                            <option key={index} value={angkatan.id_ketangkatan}>{angkatan.nama_angkatan}</option>
                        ))}
                    </Select>
                </div>
                <div className="p-4 items-center justify-center">
                    <div className="mb-2 block">
                        <Label htmlFor="btn" value="Kirim" />
                    </div>
                    <Button className='' id='btn_search' onClick={handleButtonClick}>
                        <HiOutlineArrowRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Tambahkan pengecekan untuk angkatanDetails */}
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
                        {Array.isArray(angkatanDetails) && angkatanDetails.length > 0 ? (
                            angkatanDetails.map((angkatanDetail, index) => (
                                <Table.Row key={angkatanDetail.id_user} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>{index + 1}</Table.Cell>
                                    <Table.Cell>{angkatanDetail.user.username}</Table.Cell>
                                    <Table.Cell>{angkatanDetail.user.email}</Table.Cell>
                                    <Table.Cell>{angkatanDetail.prodi.nama_prodi}</Table.Cell>
                                    <Table.Cell>
                                        <input type="checkbox" />
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        ) : (
                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell>No data available</Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </div>

            {/* Tambahkan pengecekan untuk angkatanDetails */}
            {Array.isArray(angkatanDetails) && angkatanDetails.length > 0 ? (
                <div className="flex max-w-none justify-end mt-5">
                    <div className="p-4 text-right justify-end">
                        <Select className='justify-end' id="ddl_angkatan" required onChange={e => setAngkatan(e.target.value)}>
                            <option selected disabled>Pilih jadwal harian</option>
                            <option value="1">Harian 1</option>
                            <option value="2">Harian 2</option>
                            <option value="3">Harian 3</option>
                        </Select>
                        <button
                            type="submit"
                            className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-gray-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                        >
                            Submit Kehadiran
                        </button>
                    </div>
                </div>
            ) : null}
        </>
    )
}

export default Presence;