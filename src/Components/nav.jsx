import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Avatar, Dropdown} from 'flowbite-react';
import { Logout, reset } from "../features/authSlice.js";
import { useDispatch, useSelector } from "react-redux";

const Nav = ({ username, email }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    const logout = () => {
        dispatch(Logout());
        dispatch(reset());
        navigate("/login");
    };

    return (
        <>
            <aside className="sticky z-50 top-0 w-full bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                                <span className="sr-only">Open sidebar</span>
                                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                                </svg>
                            </button>
                            <div className="self-center text-xl font-bold sm:text-2xl whitespace-nowrap dark:text-white ml-3 sm:ml-5">Resimen Kadet</div>
                        </div>
                        <div className="flex items-center">
                            <div className="flex items-center ms-3">
                                <Dropdown
                                    arrowIcon={false}
                                    inline
                                    label={
                                        <Avatar alt="User settings" className="border rounded-full border-slate-400 p-0.5" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
                                    }
                                >
                                    <Dropdown.Header>
                                        <span className="block text-sm">{username}</span>
                                        <span className="block truncate text-sm font-medium pt-1">{email}</span>
                                    </Dropdown.Header>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={logout}>Sign out</Dropdown.Item>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default Nav;