import React, { useState, useEffect } from 'react'
import { Table, Modal, Button } from 'flowbite-react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { GetwhoAmI } from "../../features/authSlice";
import axios from 'axios';

const AllPermitLists = () => {
    const [lists, setLists] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [deleteListbyId, setDeleteListbyId] = useState(null);
    const [token, setToken] = useState("");
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { isError } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(GetwhoAmI())
    }, [dispatch]);

    useEffect(() => {
        if (!openModal) {
            setOpenModal(false);
        }
    }, [openModal]);

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
        listPengajuanIzin(); // Panggil fungsi listPengajuanIzin saat komponen dimuat
    }, []);

    const listPengajuanIzin = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/listpengajuanIzin`)
            setLists(response.data.data);
        } catch (error) {
            console.error(error);
        }
    }

    const hapusPengajuanIzin = async (id_ijinkhusus) => {
        try {
            const response = await axios.delete(`http://localhost:5000/hapusPengajuanIzin/${id_ijinkhusus}`)
            if (response) {
                listPengajuanIzin();
            }
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
                        <Table.HeadCell>Nama</Table.HeadCell>
                        <Table.HeadCell>Files</Table.HeadCell>
                        <Table.HeadCell>Keterangan</Table.HeadCell>
                        <Table.HeadCell>
                            <span className="sr-only">Hapus</span>
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {Array.isArray(lists) && lists.length > 0 ? (
                            lists.map((list, index) => (
                                <Table.Row key={list.id_ijinkhusus} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>{index + 1}</Table.Cell>
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {list.user.username}
                                    </Table.Cell>
                                    <Table.Cell className='cursor-pointer'>
                                        {list.files && (
                                            <a onClick={() => window.open(`http://localhost:5000/get-file/${list.files}`)}>
                                                {list.files}
                                            </a>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>{list.ketijin.nama_ijin}</Table.Cell>
                                    <Table.Cell>
                                        <div className="text-red-800 cursor-pointer"
                                            onClick={() => {
                                                setDeleteListbyId(list.id_ijinkhusus);
                                                setOpenModal(true);
                                            }}>Hapus</div>
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
            <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Apakah Anda yakin ingin menghapus izin ini?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={async (e) => {
                                e.preventDefault();
                                await hapusPengajuanIzin(deleteListbyId);
                                setOpenModal(false); // Menutup popup setelah izin dihapus
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
        </div>
    )
}

export default AllPermitLists
