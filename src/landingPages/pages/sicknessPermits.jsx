import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from 'flowbite-react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Banner } from 'flowbite-react';
import { FaBookOpen } from 'react-icons/fa';
import { HiArrowRight, HiX } from 'react-icons/hi';
import { GetwhoAmI } from "../../features/authSlice";

const SicknessPermit = ({ id_user }) => {
    const dispatch = useDispatch();
    const [id_level, setId_level] = useState("");
    const [ijinList, setIjinList] = useState([]);
    const navigate = useNavigate();
    const { isError } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true); // Tambahkan variabel loading
    const [showForm, setShowForm] = useState(true);
    const [showBanner, setShowBanner] = useState(false);
    const [statusIjin, setStatusIjin] = useState([]);

    useEffect(() => {
        dispatch(GetwhoAmI())
            .unwrap()
            .then((decoded) => {
                setId_level(decoded.id_level);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [dispatch, isError]);

    const [formValues, setFormValues] = useState({
        id_ketijin: 0, // Set to a valid default value
        tanggal_mulai: '',
        tanggal_selesai: '',
        deskripsi: '',
        status_ijin: 1,
        files: null
    });


    useEffect(() => {
        if (formValues.id_ketijin === 0) {
            const fetchIjinList = async () => {
                try {
                    const data = await getijinbyidketijin(formValues.id_ketijin);
                    setIjinList(data || []);
                    const statusIjinArray = data.map((item) => {
                        return {
                            status_ijin: item.status_ijin,
                            id_ijinkhusus: item.id_ijinkhusus
                        };
                    });
                    setStatusIjin(statusIjinArray);
                    setLoading(false); // Set loading to false after data is fetched
                } catch (error) {
                    console.error("Error fetching ijin list:", error);
                    setLoading(false); // Set loading to false in case of error
                }
            };
            fetchIjinList();
        }
    }, [formValues.id_ketijin]);


    const handleInputChange = (e) => {
        let value = e.target.value;
        if (e.target.name === 'id_ketijin' || e.target.name === 'status_ijin') {
            value = parseInt(value);
        }
        setFormValues({
            ...formValues,
            [e.target.name]: value
        });
    };

    const handleFileChange = (e) => {
        setFormValues({
            ...formValues,
            files: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("id_ketijin", formValues.id_ketijin);
            formData.append("tanggal_mulai", formValues.tanggal_mulai);
            formData.append("tanggal_selesai", formValues.tanggal_selesai);
            formData.append("deskripsi", formValues.deskripsi);
            formData.append("status_ijin", 1);
            formData.append("files", formValues.files);
            formData.append("id_user", id_user);

            const response = await axios.post(`http://localhost:5000/sicknessPermit/${id_user}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log(response.data); // Handle successful response

            // Update ijinList with new data
            const data = await getijinbyidketijin(formValues.id_ketijin);
            setIjinList([...ijinList, data || []]); // Initialize data as empty array if it's undefined
            setShowForm(false)
            setShowBanner(true);

        } catch (error) {
            console.error(error); // Handle error
        }
    };

    const getijinbyidketijin = async (id_ijinkhusus) => {
        try {
            const response = await axios.get(`http://localhost:5000/getijinbyidketijin/${id_ijinkhusus}`)
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    const approvedIjinSakit = async (id_ijinkhusus) => {
        try {
            const response = await axios.patch(`http://localhost:5000/approvedIjinSakit/${id_ijinkhusus}`)
            updateStatusIjin(id_ijinkhusus, 5); // Update status_ijin to 5 (Diterima)
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    const deleteIjin = async (id_ijinkhusus) => {
        try {
            const response = await axios.patch(`http://localhost:5000/deleteijin/${id_ijinkhusus}`)
            updateStatusIjin(id_ijinkhusus, 0); // Update status_ijin to 0 (Ditolak)
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    // Function to update status_ijin for a specific id_ijinkhusus
    const updateStatusIjin = (id, newStatus) => {
        const updatedStatusIjin = statusIjin.map(item =>
            item.id_ijinkhusus === id ? { ...item, status_ijin: newStatus } : item
        );

        setStatusIjin(updatedStatusIjin);
    };

    useEffect(() => {
        if (isError) {
            navigate('/login');
        }
    }, [isError, navigate]);

    return (
        <div>
            {id_level === 6 && (
                <section className="max-w p-6 mx-auto dark:bg-gray-800">
                    <h1 className="text-2xl font-bold text-gray-700 capitalize dark:text-white">Perizinan Sakit</h1>
                    {showBanner && (
                        <Banner>
                            <div className="flex mt-5 w-full flex-col justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700 md:flex-row">
                                <div className="mb-4 md:mb-0 md:mr-4">
                                    <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
                                        {formValues.id_ketijin === 0 ? 'Sakit' : ''}
                                    </h2>
                                    <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                                        {formValues.deskripsi}
                                    </p>
                                </div>
                                <div className="flex flex-shrink-0 items-center">
                                    <a
                                        href="#"
                                        className="mr-2 inline-flex items-center justify-center rounded-lg bg-cyan-700 px-3 py-2 text-xs font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                                    >
                                        {formValues.status_ijin === 1 ? 'Pending on Admin' : ''}
                                    </a>
                                    <Banner.CollapseButton color="gray" className="border-0 bg-transparent text-gray-500 dark:text-gray-400">
                                        <HiX className="h-4 w-4" />
                                    </Banner.CollapseButton>
                                </div>
                            </div>
                        </Banner>
                    )}
                    {showForm && (
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                                <div>
                                    <label className="text-gray-700 dark:text-gray-200" htmlFor="keteranganIzin">Keterangan Izin</label>
                                    <select
                                        id="keteranganIzin"
                                        name="id_ketijin"
                                        value={formValues.id_ketijin}
                                        disabled
                                        onChange={handleInputChange}
                                        className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                                    >
                                        <option value="0">Sakit</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-gray-700 dark:text-gray-200" htmlFor="statusIzin">Status Izin</label>
                                    <input
                                        id="statusIzin"
                                        name="status_ijin"
                                        type="text"
                                        value="Kadet Mahasiswa"
                                        disabled
                                        onChange={handleInputChange}
                                        className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-700 dark:text-gray-200" htmlFor="tanggalMulai">Tanggal Mulai</label>
                                    <input
                                        id="tanggalMulai"
                                        name="tanggal_mulai"
                                        type="date"
                                        value={formValues.tanggal_mulai}
                                        onChange={handleInputChange}
                                        className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-700 dark:text-gray-200" htmlFor="tanggalSelesai">Tanggal Selesai</label>
                                    <input
                                        id="tanggalSelesai"
                                        name="tanggal_selesai"
                                        type="date"
                                        value={formValues.tanggal_selesai}
                                        onChange={handleInputChange}
                                        className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-700 dark:text-gray-200" htmlFor="deskripsi">Deskripsi</label>
                                    <textarea
                                        id="deskripsi"
                                        name="deskripsi"
                                        value={formValues.deskripsi}
                                        onChange={handleInputChange}
                                        className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Surat Dokter
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        {formValues.files ? (
                                            <div className="relative">
                                                <img src={URL.createObjectURL(formValues.files)} alt="Preview" className="mt-2 w-64" />
                                                <label htmlFor="file-upload" className="absolute inset-0 flex items-center justify-center cursor-pointer">
                                                    <svg className="mx-auto h-12 w-12 text-black hover:text-gray-500 transition duration-300 ease-in-out cursor-pointer" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <input
                                                        id="file-upload"
                                                        name="files"
                                                        type="file"
                                                        onChange={handleFileChange}
                                                        className="sr-only"
                                                    />
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="space-y-1 text-center">
                                                <svg className="mx-auto h-12 w-12 text-gray-700" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <div className="flex text-sm text-gray-600">
                                                    <label htmlFor="file-upload" className="relative cursor-pointer font-bold text-gray-900 hover:text-gray-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 ">
                                                        <span className="">Upload a file</span>
                                                        <input
                                                            id="file-upload"
                                                            name="files"
                                                            type="file"
                                                            onChange={handleFileChange}
                                                            className="sr-only" />
                                                    </label>
                                                    <p className="pl-1 text-gray-700">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-700">
                                                    PNG, JPG, GIF up to 10MB
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-6">
                                <button type="submit" className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-pink-500 rounded-md hover:bg-pink-700 focus:outline-none focus:bg-gray-600">Save</button>
                            </div>
                        </form>
                    )}
                </section>
            )}
            {id_level === 1 && (
                <div className="overflow-x-auto">
                    <Table striped>
                        <Table.Head>
                            <Table.HeadCell>No</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>Files</Table.HeadCell>
                            <Table.HeadCell>Status Ijin</Table.HeadCell>
                            <Table.HeadCell>
                                <span className="sr-only">Edit</span>
                            </Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {loading ? (
                                <tr>
                                    <td colSpan="5">Loading...</td>
                                </tr>
                            ) : (
                                ijinList.map((ijin, index) => (
                                    <Table.Row key={index}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell>{ijin.user && ijin.user.username}</Table.Cell>
                                        <Table.Cell className="cursor-pointer">
                                            {ijin.files && (
                                                <a onClick={() => window.open(`http://localhost:5000/get-file/${ijin.files}`)}>
                                                    {ijin.files}
                                                </a>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {statusIjin[index].status_ijin === 1 ? 'Menunggu Admin' : statusIjin[index].status_ijin === 0 ? 'Ditolak' : statusIjin[index].status_ijin === 5 ? 'Diterima' : ''}
                                        </Table.Cell>
                                        {statusIjin[index].status_ijin === 1 ? (
                                            <Table.Cell className="flex">
                                                <>
                                                    <div
                                                        className="bg-gray-100 px-2.5 mx-2 rounded-lg shadow-md inline-block cursor-pointer"
                                                        onClick={() => approvedIjinSakit(ijin.id_ijinkhusus)} // asumsikan `ijin` adalah objek yang memiliki properti `id_ketijin`
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="lucide lucide-check"
                                                            color="green"
                                                        >
                                                            <path d="M20 6 9 17l-5-5" />
                                                        </svg>
                                                    </div>
                                                    <div
                                                        className="bg-gray-100 px-2.5 rounded-lg mx-2 shadow-md inline-block cursor-pointer"
                                                        onClick={() => deleteIjin(ijin.id_ijinkhusus)}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="lucide lucide-x"
                                                            color="red"
                                                        >
                                                            <path d="M18 6 6 18" />
                                                            <path d="m6 6 12 12" />
                                                        </svg>
                                                    </div>
                                                </>
                                            </Table.Cell>
                                        ) : <Table.Cell className="flex"></Table.Cell>}
                                    </Table.Row>
                                ))
                            )}
                        </Table.Body>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default SicknessPermit;
