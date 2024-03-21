// ProtectedRoutes.js
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from '../landingPages/pages/homeBoard';
import Presence from '../landingPages/pages/presencesCadet';
import ExternalApplication from '../landingPages/pages/ExternalApplications';
import AttendanceforExternal from '../landingPages/pages/attendanceforExternals';
import LeaveApplication from '../landingPages/pages/LeaveApplications';
import SicknessPermit from '../landingPages/pages/sicknessPermits';
import Help from '../landingPages/pages/Helps';
import Listusers from '../landingPages/pages/listUsers';
import CreateProfile from '../landingPages/pages/createProfile';
import Notfound from '../landingPages/pages/404notfound';

export const getRoleFromIdLevel = (id_level) => {
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


const ProtectedRoutes = ({ id_level, id_user}) => {



    const role = getRoleFromIdLevel(id_level);
    // console.log(role);


    return (
        <Routes>
            <Route path="/" element={<Home />} />
            {role === 'admin' && (
                <>
                    <Route path='/presenceCadet' element={<Presence/>} />
                    <Route path='/externalApplication/:id_user' element={<ExternalApplication id_user={id_user} />} />
                    <Route path='/attendanceforExternal' element={<AttendanceforExternal />} />
                    <Route path='/leaveApplication/:id_user' element={<LeaveApplication id_user={id_user} />} />
                    <Route path='/sicknessPermit/:id_user' element={<SicknessPermit id_user={id_user} />} />
                    <Route path='/listUsers' element={<Listusers />} />
                    <Route path='/createProfile' element={<CreateProfile />} />
                    <Route path='/help' element={<Help />} />
                </>

            )}
            {role === 'Karo AK' && (
                <>
                    <Route path='/externalApplication/:id_user' element={<ExternalApplication id_user={id_user} />} />
                    <Route path='/leaveApplication/:id_user' element={<LeaveApplication id_user={id_user} />} />
                    <Route path='/help' element={<Help />} />
                </>
            )}
            {role === 'Dekan' && (
                <>
                    <Route path='/externalApplication/:id_user' element={<ExternalApplication id_user={id_user} />} />
                    <Route path='/leaveApplication/:id_user' element={<LeaveApplication id_user={id_user} />} />
                    <Route path='/help' element={<Help />} />
                </>
            )}
            {role === 'Kaprodi' && (
                <>
                    <Route path='/externalApplication/:id_user' element={<ExternalApplication id_user={id_user} />} />
                    <Route path='/leaveApplication/:id_user' element={<LeaveApplication id_user={id_user} />} />
                    <Route path='/help' element={<Help />} />
                </>
            )}
            {role === 'Dosen' && (
                <>
                    <Route path='/presenceCadet' element={<Presence />} />
                    <Route path='/help' element={<Help />} />
                </>
            )}
            {role === 'Kadet Mahasiswa' && (
                <>
                    <Route path='/externalApplication/:id_user' element={<ExternalApplication id_user={id_user} />} />
                    <Route path='/attendanceforExternal' element={<AttendanceforExternal />} />
                    <Route path='/leaveApplication/:id_user' element={<LeaveApplication id_user={id_user} />} />
                    <Route path="/sicknessPermit/:id_user" element={<SicknessPermit id_user={id_user} />} />
                    <Route path='/help' element={<Help />} />
                </>
            )}
            <Route path="*" element={<Notfound />} />
        </Routes>
    );
}

export default ProtectedRoutes;