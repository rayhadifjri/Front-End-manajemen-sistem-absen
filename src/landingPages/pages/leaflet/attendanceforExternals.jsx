import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetwhoAmI } from "../../../features/authSlice";
import { MapContainer , TileLayer } from "react-leaflet";
import osmProviders from "./osm-providers";
import "leaflet/dist/leaflet.css";

const AttendanceforExternal = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [location, setLocation] = useState({
        loaded: false,
        coordinates: {
            lat: "",
            lng: ""
        }
    })
    const [center, setCenter] = useState({ lat: 13.084622, lng: 80.248357 });
    const ZOOM_LEVEL = 13;
    const mapRef = useRef();
    const { isError } = useSelector((state) => state.auth);

    useEffect(() => {

    },[])

    useEffect(() => {
        dispatch(GetwhoAmI())
    }, [dispatch]);

    useEffect(() =>{
        if (isError) {
            navigate('/login');
        }
    }, [isError, navigate]);


    return (
        <>
            <div className="">
                <div className="text-center">
                    <h2>React Leaflet - Maps</h2>
                    <p>Loading basic map</p>
                    <div className="w-2/6">
                        <MapContainer className="h-60 w-full"
                            center={center}
                            zoom={ZOOM_LEVEL}
                            ref={mapRef}
                        >
                            <TileLayer url={osmProviders.maptiler.url}/>
                        </MapContainer>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AttendanceforExternal
