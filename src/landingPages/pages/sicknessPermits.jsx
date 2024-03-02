import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const SicknessPermit = ({ id_user }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError } = useSelector((state) => state.auth);
    const [formValues, setFormValues] = useState({
        id_ketijin: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        files: '',
        deskripsi: '',
        status_ijin: ''
    });

    const handleInputChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
    
        reader.onload = (event) => {
            setFormValues({
                ...formValues,
                files: event.target.result
            });
        };
    
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("id_ketijin", formValues.id_ketijin);
            formData.append("tanggal_mulai", formValues.tanggal_mulai);
            formData.append("tanggal_selesai", formValues.tanggal_selesai);
            formData.append("files", formValues.files);
            formData.append("deskripsi", formValues.deskripsi);
            formData.append("status_ijin", formValues.status_ijin);
            formData.append("id_user", id_user); // Tambahkan id_user ke dalam FormData
    
            const response = await axios.post(`http://localhost:5000/sicknessPermit/${id_user}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log(response.data); // Handle successful response
        } catch (error) {
            console.error(error); // Handle error
        }
    };
    

    useEffect(() => {
        // Your useEffect code
    }, []); // Adjust dependencies as needed

    useEffect(() => {
        if (isError) {
            navigate('/login');
        }
    }, [isError, navigate]);

    return (
        <div>
            <section className="max-w p-6 mx-auto dark:bg-gray-800">
                <h1 className="text-2xl font-bold text-gray-700 capitalize dark:text-white">Perizinan Sakit</h1>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                        <div>
                            <label className="text-gray-700 dark:text-gray-200" htmlFor="keteranganIzin">Keterangan Izin</label>
                            <select
                                id="keteranganIzin"
                                name="id_ketijin"
                                value={formValues.id_ketijin}
                                onChange={handleInputChange}
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                            >
                                <option value="1">Sakit</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-gray-700 dark:text-gray-200" htmlFor="statusIzin">Status Izin</label>
                            <input
                                id="statusIzin"
                                name="status_ijin"
                                type="text"
                                value={formValues.status_ijin}
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
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-700" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer font-bold text-gray-900 hover:text-gray-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 ">
                                            <span className="">Upload a file</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
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
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end mt-6">
                        <button type="submit" className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-pink-500 rounded-md hover:bg-pink-700 focus:outline-none focus:bg-gray-600">Save</button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default SicknessPermit;
