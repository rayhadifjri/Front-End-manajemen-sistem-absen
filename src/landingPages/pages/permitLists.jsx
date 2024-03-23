import React, { useState, useEffect } from 'react'
import { Table } from 'flowbite-react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetwhoAmI } from "../../features/authSlice";
import axios from 'axios';

const PermitLists = ({ id_user }) => {
    const [lists, setLists] = useState([]);
    const [token, setToken] = useState("");
    const dispatch = useDispatch()
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

    useEffect(() => {
        tokenization(); // Panggil fungsi tokenization saat komponen dimuat
    }, []);

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
        pengajuanIzin(id_user); // Panggil getUsers setelah token didapatkan
    }, [id_user]);

    const pengajuanIzin = async (id_user) => {
        try {
            const response = await axios.get(`http://localhost:5000/pengajuanIzin/${id_user}`)
            setLists(response.data.message);
            console.log(response.data.message)
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <div className="overflow-x-auto">
                <Table>
                    <Table.Head>
                        <Table.HeadCell>No</Table.HeadCell>
                        <Table.HeadCell>Deskripsi</Table.HeadCell>
                        <Table.HeadCell>Files</Table.HeadCell>
                        <Table.HeadCell>Tanggal Mulai</Table.HeadCell>
                        <Table.HeadCell>Tanggal Selesai</Table.HeadCell>
                        <Table.HeadCell>
                            <span className="sr-only">Status Izin</span>
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {Array.isArray(lists) && lists.length > 0 ? (
                            lists.map((list, index) => (
                                <Table.Row key={list.id_ijinkhusus} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>{index + 1}</Table.Cell>
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {list.deskripsi}
                                    </Table.Cell>
                                    <Table.Cell className='cursor-pointer'>
                                        {list.files && (
                                            <a onClick={() => window.open(`http://localhost:5000/get-file/${list.files}`)}>
                                                {list.files}
                                            </a>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>{list.tanggal_mulai}</Table.Cell>
                                    <Table.Cell>{list.tanggal_selesai}</Table.Cell>
                                    <Table.Cell>
                                        {list.status_ijin === 0 ? (
                                            <span className="text-red-500 font-medium">Ditolak</span>
                                        ) : list.status_ijin === 5 ? (
                                            <span className="text-green-500 font-medium">Diterima</span>
                                        ) : (
                                            <span className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                                                {list.status_ijin}
                                            </span>
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        ) : (
                            <Table.Row>
                                <Table.Cell colSpan={6}>No data available</Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </div>
        </div>
    )
}

export default PermitLists
