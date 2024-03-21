import { Sidebar, Badge } from 'flowbite-react';
import { BiBuoy } from 'react-icons/bi';
import { HiArrowSmRight, HiChartPie, HiShoppingBag, HiTable } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';

export const getRoleIdLevel = (id_level) => {
    // Misalkan peran admin memiliki id_level 1,
    // peran user memiliki id_level 2, dan peran external memiliki id_level 3
    if (id_level === 1) {
        return 'admin';
    } else if (id_level === 2) {
        return 'Karo AK';
    } else if (id_level === 3) {
        return 'Dekan';
    } else if (id_level === 4) {
        return 'Kaprodi';
    } else if (id_level === 5) {
        return 'Dosen';
    } else if (id_level === 6) {
        return 'Kadet Mahasiswa';
    } else {
        return 'Unknown Role'; // Default role jika id_level tidak sesuai
    }
};

export default function Sidebars({ id_level, id_user }) {
    const [isCTACollapsed, setCTACollapsed] = useState(false);

    let role = 'rendering';
    if (id_level) {
        role = getRoleIdLevel(id_level);
    }
    console.log(role);

    const toggleCTA = () => {
        setCTACollapsed(!isCTACollapsed);
    };

    return (
        // Sidebar
        <>
            <Sidebar id_user={id_user} id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full bg- border-r border-gray-200 sm:translate-x-0 mt-14 pt-2" aria-label="Sidebar">
                <div className="h-full px-3 pb-4 overflow-y-auto ">
                    <Sidebar.Items>
                        <Sidebar.ItemGroup>
                            <Sidebar.Item className='cursor-auto' as={Link} to={"/"} icon={HiChartPie}>
                                Home
                            </Sidebar.Item>
                            <Sidebar.Collapse icon={HiShoppingBag} label="Presence Center">
                                {(role === 'admin' || role === 'Dosen') && (
                                    <Sidebar.Item as={Link} to={"/presenceCadet"}>Presence</Sidebar.Item>
                                )}
                                {(role === 'admin' || role === 'Karo AK' || role === 'Dekan' || role === 'Kaprodi' || role === 'Kadet Mahasiswa') && (
                                    <Sidebar.Item as={Link} to={`/externalApplication/${id_user}`}>External Application</Sidebar.Item>
                                )}
                                {(role === 'admin' || role === 'Kadet Mahasiswa') && (
                                    <Sidebar.Item as={Link} to={"/attendanceforExternal"}>External's Presence</Sidebar.Item>
                                )}
                                {(role === 'admin' || role === 'Karo AK' || role === 'Dekan' || role === 'Kaprodi' || role === 'Kadet Mahasiswa') && (
                                    <Sidebar.Item as={Link} to={`/leaveApplication/${id_user}`}>Leave Application</Sidebar.Item>
                                )}
                                {(role === 'admin' || role === 'Kadet Mahasiswa') && (
                                    <Sidebar.Item as={Link} to={`/sicknessPermit/${id_user}`}>Sickness Permit</Sidebar.Item>
                                )}
                            </Sidebar.Collapse>
                            {role === 'admin' && (
                                <Sidebar.Item as={Link} to={"/listUsers"} icon={HiArrowSmRight}>
                                    List Users
                                </Sidebar.Item>
                            )}
                            {role === 'admin' && (
                                <Sidebar.Item as={Link} to={"/createProfile"} icon={HiTable}>
                                    Create Profile
                                </Sidebar.Item>
                            )}
                        </Sidebar.ItemGroup>
                        <Sidebar.ItemGroup>
                            <Sidebar.Item as={Link} to={"/help"} icon={BiBuoy}>
                                Help
                            </Sidebar.Item>
                        </Sidebar.ItemGroup>
                        <Sidebar.CTA>
                            <div className="mb-3 flex items-center">
                                <Badge color="warning">Beta</Badge>
                                <button
                                    aria-label="Close"
                                    className="-m-1.5 ml-auto inline-flex h-6 w-6 rounded-lg bg-gray-100 p-1 text-cyan-900 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                                    type="button"
                                    onClick={toggleCTA}
                                >
                                    <svg
                                        aria-hidden
                                        className="h-4 w-4"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className={`mb-3 text-sm ${isCTACollapsed ? 'hidden' : ''} text-cyan-900 dark:text-gray-400`}>
                                Preview the new Flowbite dashboard navigation! You can turn the new navigation off for a limited time in your
                                profile.
                            </div>
                            <a
                                className={`text-sm ${isCTACollapsed ? 'hidden' : ''} text-cyan-900 underline hover:text-cyan-800 dark:text-gray-400 dark:hover:text-gray-300`}
                                href="#"
                            >
                                Turn new navigation off
                            </a>
                        </Sidebar.CTA>
                    </Sidebar.Items>
                </div>
            </Sidebar>
        </>
    );
}